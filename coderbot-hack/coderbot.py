from rotary_encoder.wheelsaxel import WheelsAxel
import pigpio

# GPIO
class GPIO_CODERBOT_V_4():
    # motors
    PIN_MOTOR_ENABLE = 22
    PIN_LEFT_FORWARD = 25
    PIN_LEFT_BACKWARD = 24
    PIN_RIGHT_FORWARD = 4
    PIN_RIGHT_BACKWARD = 17

    PIN_PUSHBUTTON = 11
    # servo
    PIN_SERVO_1 = 9
    PIN_SERVO_2 = 10
    # sonar
    PIN_SONAR_1_TRIGGER = 18
    PIN_SONAR_1_ECHO = 7
    PIN_SONAR_2_TRIGGER = 18
    PIN_SONAR_2_ECHO = 8
    PIN_SONAR_3_TRIGGER = 18
    PIN_SONAR_3_ECHO = 23
    PIN_SONAR_4_TRIGGER = 18
    PIN_SONAR_4_ECHO = None

    # encoder
    PIN_ENCODER_LEFT_A = 14
    PIN_ENCODER_LEFT_B = 6
    PIN_ENCODER_RIGHT_A = 15
    PIN_ENCODER_RIGHT_B = 12

class CoderBot():

    def __init__(self, motor_trim_factor=1.0):
        self._motor_trim_factor = motor_trim_factor
        self.motor_control = self._dc_enc_motor
        self.GPIOS = GPIO_CODERBOT_V_4()
        self._pin_out = [self.GPIOS.PIN_LEFT_FORWARD, self.GPIOS.PIN_RIGHT_FORWARD, self.GPIOS.PIN_LEFT_BACKWARD, self.GPIOS.PIN_RIGHT_BACKWARD, self.GPIOS.PIN_SERVO_1, self.GPIOS.PIN_SERVO_2]
        self.pi = pigpio.pi('localhost')
        self.pi.set_mode(self.GPIOS.PIN_PUSHBUTTON, pigpio.INPUT)
        self._twin_motors_enc = WheelsAxel(
            self.pi,
            enable_pin=self.GPIOS.PIN_MOTOR_ENABLE,
            left_forward_pin=self.GPIOS.PIN_LEFT_FORWARD,
            left_backward_pin=self.GPIOS.PIN_LEFT_BACKWARD,
            left_encoder_feedback_pin_A=self.GPIOS.PIN_ENCODER_LEFT_A,
            left_encoder_feedback_pin_B=self.GPIOS.PIN_ENCODER_LEFT_B,
            right_forward_pin=self.GPIOS.PIN_RIGHT_FORWARD,
            right_backward_pin=self.GPIOS.PIN_RIGHT_BACKWARD,
            right_encoder_feedback_pin_A=self.GPIOS.PIN_ENCODER_RIGHT_A,
            right_encoder_feedback_pin_B=self.GPIOS.PIN_ENCODER_RIGHT_B)

    def forward(self, speed=100, elapse=0, distance=0):
        self.move(speed=speed, elapse=elapse, distance=distance)

    def move(self, speed=100, elapse=0, distance=0):
        self._motor_trim_factor = 1.0
        speed_left = min(100, max(-100, speed * self._motor_trim_factor))
        speed_right = min(100, max(-100, speed / self._motor_trim_factor))
        self.motor_control(speed_left=speed_left, speed_right=speed_right, time_elapse=elapse, target_distance=distance)
    
    def _dc_enc_motor(self, speed_left=100, speed_right=100, time_elapse=0, target_distance=0):
        self._twin_motors_enc.control(power_left=speed_left,
                                      power_right=speed_right,
                                      time_elapse=time_elapse,
                                      target_distance=target_distance)


  