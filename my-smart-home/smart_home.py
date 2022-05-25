import fliclib
import lifx
import utils
import config

logger = utils.init_log()
c = config.get_config()

client = fliclib.FlicClient("localhost")

def got_button(bd_addr):
	cc = fliclib.ButtonConnectionChannel(bd_addr)
	cc.on_button_single_or_double_click_or_hold = \
		lambda channel, click_type, was_queued, time_diff: \
			logger.info(channel.bd_addr + " " + str(click_type))
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
