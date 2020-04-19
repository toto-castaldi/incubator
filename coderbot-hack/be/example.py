from gpio import *
import pigpio
from config import Config
import time


config = Config.get_instance()
gpio_pins = GPIO_CODERBOT_V_4()
pi = pigpio.pi(config.data.get('pigpio').get('host'))

# ENABLE MOTORS
pi.write(gpio_pins.PIN_MOTOR_ENABLE, True)

## set_PWM_dutycycle(user_gpio, dutycycle)
pi.set_PWM_dutycycle(GPIO_CODERBOT_V_4.PIN_RIGHT_FORWARD, 128)
time.sleep(5)
pi.set_PWM_dutycycle(GPIO_CODERBOT_V_4.PIN_RIGHT_BACKWARD, 0)

