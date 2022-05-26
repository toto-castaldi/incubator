import fliclib
import lifx
import utils
import config

logger = utils.init_log()
c = config.get_config()

client = fliclib.FlicClient("localhost")

def wrapped_toggle(action_id):
	logger.debug(action_id)
	lifx.toggle(action_id, c["lifx_api_key"])

actions = {
	"toggle-lifx" : wrapped_toggle
}

def on_button_single_or_double_click_or_hold(channel, click_type, was_queued, time_diff):
	bd_addr = channel.bd_addr
	c_type = str(click_type)
	logger.info(f"{bd_addr} -> {c_type}")
	button = config.search_button(bd_addr)
	if button is not None:
		action = config.search_action(button, c_type)
		if action is not None:
			logger.debug(action)
			actions[action["action"]](action["action_id"])
		else:
			logger.warning(f"unknow {c_type} action on button {bd_addr}")	
	else:
		logger.warn(f"unknow {bd_addr} button")

def got_button(bd_addr):
	cc = fliclib.ButtonConnectionChannel(bd_addr)
	cc.on_button_single_or_double_click_or_hold = on_button_single_or_double_click_or_hold
	cc.on_connection_status_changed = \
		lambda channel, connection_status, disconnect_reason: \
			logger.info(channel.bd_addr + " " + str(connection_status) + (" " + str(disconnect_reason) if connection_status == fliclib.ConnectionStatus.Disconnected else ""))
	client.add_connection_channel(cc)

def got_info(items):
	logger.debug(items)
	for bd_addr in items["bd_addr_of_verified_buttons"]:
		got_button(bd_addr)

logger.debug(c)

lifx.list_lights(c["lifx_api_key"])

client.get_info(got_info)

client.on_new_verified_button = got_button

client.handle_events()
