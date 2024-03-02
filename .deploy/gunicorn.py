import multiprocessing

name = 'academy'
bind = '0.0.0.0:31700'
proc_name = 'django_academy'
daemon = False
errorlog = '/var/log/academy/gunicorn_error.log'
loglevel = 'info'
worker_class = 'sync'

workers = multiprocessing.cpu_count() * 2 + 1