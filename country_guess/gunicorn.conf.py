bind = '0.0.0.0:5000'
workers = 3

accesslog = '-'
errorlog = '/var/log/gunicorn/error.log'
capture_output = False
loglevel = 'info'
