#!/usr/bin/env python3
#----------------------------------------------------------------
#	Note:
#		ds18b20's data pin must be connected to pin7.
#		replace the 28-XXXXXXXXX as yours.
#----------------------------------------------------------------
from datetime import datetime
import os,time,json
ds18b20 = ''

def setup():
	global ds18b20
	for i in os.listdir('/sys/bus/w1/devices'):
		if i != 'w1_bus_master1':
			ds18b20 = '28-031597792a7d'

def read():
#	global ds18b20
	location = '/sys/bus/w1/devices/' + ds18b20 + '/w1_slave'
	tfile = open(location)
	text = tfile.read()
	tfile.close()
	secondline = text.split("\n")[1]
	temperaturedata = secondline.split(" ")[9]
	temperature = float(temperaturedata[2:])
	temperature = temperature / 1000
	return temperature
	
def loop():
	while True:
		start_time= time.time()
		temp =read()
		if temp != None:
			end_time=time.time()
			elapsed_time=start_time-end_time
   
			data = {
				"temperature":temp,
				"time":datetime.now().strftime("%d/%m/%Y %H:%M:%S")
			}
			string_temp=json.dumps(data)	

			if(1-elapsed_time>0):
				time.sleep(1-elapsed_time)

			print(string_temp)

def destroy():
	pass

if __name__ == '__main__':
	try:
		setup()
		loop()
	except KeyboardInterrupt:
		destroy()

