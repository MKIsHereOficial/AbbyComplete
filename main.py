# Imports
import time
import threading
import os
from os import sys

# Bot App
def bot():
    print("Iniciando Abby... {}".format(str(int(time.time()))))
    path = os.getcwd()
    path = os.path.join(path, "bot")
    os.system('cmd /k "cd {} && npm run dev"'.format(path))

# Web App
def web():
    print("Iniciando o Castelo... {}".format(str(int(time.time()))))
    path = os.getcwd()
    path = os.path.join(path, "web")
    os.system('cmd /k "cd {} && npm start"'.format(path))

# Main

botT = threading.Thread(target=bot)
botT.start()

webT = threading.Thread(target=web)
#webT.start()