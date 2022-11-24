#!/usr/bin/env python3
import RPi.GPIO as  GPIO
import importlib
import random, time
from paho.mqtt import client as mqtt_client

broker = 'broker.hivemq.com'
port = 1883
topic = "/gti780a2021alerts/equipe04/alert"
client_id = f'python-mqtt-labGTI700_2022-{random.randint(0, 1000)}'


# BOARD pin numbering
LedR	=	32
LedG	=	33
LedB	=   12


rgb	=	importlib.import_module('rgb_led')

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)
    # Set Connecting Client ID
    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
		def on_message(client, userdata, msg):
				color=msg.payload.decode().split(';')
				print(color)
				rgb.setColor(int(color[0]),int(color[1]),int(color[2]))
				print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")

		client.subscribe(topic)
		client.on_message = on_message


def setup():
	print("Start setup")
	
	
	client = connect_mqtt()
	subscribe(client)
	client.loop_forever()
  

rgb.setup(LedR, LedG, LedB)


def destroy():

	rgb.destroy()

if __name__ == "__main__":
	try:
		setup()
	except KeyboardInterrupt:
		destroy()
