from gpiozero import MotionSensor
from picamera import PiCamera
import RPi.GPIO as GPIO
from time import sleep
from datetime import datetime
import sys
import signal

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)

pir = MotionSensor(4)

camera = PiCamera()
camera.resolution = (1280, 720)
camera.framerate = 30
camera.rotation = 180

led_pin = 18
GPIO.output(led_pin,False)
sleep(0.1)

class GracefulKiller:
  kill_now = False
  def __init__(self):
    signal.signal(signal.SIGINT, self.exit_gracefully)
    signal.signal(signal.SIGTERM, self.exit_gracefully)

  def exit_gracefully(self,signum, frame):
    self.kill_now = True
    
try:
    killer = GracefulKiller()
    while not killer.kill_now:
        pir.wait_for_motion()
#        print("Motion detected!")
        filename = "/home/pi/Desktop/"+datetime.strftime(datetime.now(), "%Y-%m-%d_%H:%M:%S")
#        camera.start_preview()
        videofile = filename+'.h264'
        camera.start_recording(videofile)
#        print("Recording started.....")
        GPIO.output(led_pin,True)
        sleep(2)
        capturefile = filename+'.jpg'
        camera.capture(capturefile)
        
        pir.wait_for_no_motion()
        camera.stop_recording()
#        print("Recording stopped.....")
#        camera.stop_preview()
        GPIO.output(led_pin, False)
        print([videofile, capturefile])
        sys.stdout.flush()
        sleep(1)
        
    print("End of program")
except KeyboardInterrupt:
    print("EXIT")
#    camera.stop_preview()
    sys.exit()
