#!/usr/bin/env python
import LCD1602
import time, sys, json

def setup():
	LCD1602.init(0x27, 1)	# init(slave address, background light)

def printValues():
	data = json.loads(sys.argv[1])

	temp_humid = "[i] " + str(data['temperature']) + "C, " +str(data['humidity']) + "%"
	temp_minmax = "[m]Tmin:" + str(data['min_temp']['value']) + "C" + "["+ str(data['min_temp']['team']) + "], Tmax:" + str(data['max_temp']['value']) + "C" + "[" + str(data['max_temp']['team']) + "]"
	humid_minmax = "[n]Hmin:" + str(data['min_humid']['value']) + "% " + "[" + str(data['min_humid']['team']) + "], Hmax" + str(data['max_humid']['value']) + "%" + "[" + str(data['max_humid']['team']) + "]"
	meteo = "[e] " + str(data['meteo']['temperature']) + "C, " +str(data['meteo']['humidity']) + "%, " +str(data['meteo']['windspeed']) + "km/h"
	
	LCD1602.write(0,0,temp_humid)
	time.sleep(5)
	LCD1602.clear()

	LCD1602.write(0,0,temp_minmax)
	time.sleep(5)
	LCD1602.clear()

	LCD1602.write(0,0,humid_minmax)
	time.sleep(5)
	LCD1602.clear()

	LCD1602.write(0,0,meteo)
	time.sleep(5)
	LCD1602.clear()

	
def destroy():
	pass	

if __name__ == "__main__":
	try:
		setup()
		while True:
			printValues()
			pass
	except KeyboardInterrupt:
		destroy()