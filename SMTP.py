from datetime import datetime
import asyncore
import os
#from smtpd import SMTPServer
from secure_smtpd import SMTPServer

class CredentialValidator(object):
    def validate(self, username, password):
        if(username == 'TP2' and password == 'TRAB4'):
            return True
        return False

class EmailServer(SMTPServer):
    no = 0
    def process_message(self, peer, mailfrom, rcpttos, data):
        # create mail dir
        if(not os.path.exists("mails")):
            os.mkdir("mails")

        # create each user mail dir
        for m in rcpttos:
            if(not os.path.exists("mails/" + m)):
                os.mkdir("mails/" + m)

        # save each mail 
        for m in rcpttos:
            filename = 'mails/' + m + '/%s-%d.eml' % (datetime.now().strftime('%Y%m%d%H%M%S'),
                    self.no)
            f = open(filename, 'w')
            f.write(data)
            f.close
            print('%s saved.' % filename)
            print('from: ', mailfrom)
            print('peer: ', peer)
            print('rcpttos: ', rcpttos)

        self.no += 1


def run():
    # start the smtp server on localhost:1025
    foo = EmailServer(
            ('localhost', 1025),
            None,
            require_authentication=True,
            ssl=True,
            certfile='localhost.cert',
            keyfile='localhost.key',
            credential_validator=CredentialValidator(),
            maximum_execution_time = 1.0
        )

    foo.run()

run()