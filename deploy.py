# Imports
import os

# variables
path = os.getcwd()


# Build
print("Iniciando build e deploy...")
web_path = os.path.join(path, "web")
os.system('cmd /k "cd {} && npm run build"'.format(web_path))

# Deploy
os.system('cmd /k "cd {} && firebase deploy"'.format(path))