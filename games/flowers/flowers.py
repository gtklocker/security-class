#!/usr/bin/python
# -*- coding: utf-8 -*-
# Filename: flowers.py

import cgi, os, sys, smtplib, re, ConfigParser
from time import gmtime, strftime

# Path of configuration file.
CONFIG = "config.ini"

def config_section_map(section):
    """
    Map the values of a config file to a dictionary.
    """

    config = ConfigParser.ConfigParser()
    config.read(CONFIG)
    dict1 = {}
    options = config.options(section)
    for option in options:
        try:
            dict1[option] = config.get(section, option)
        except:
            print("exception on %s!" % option)
            dict1[option] = None
    return dict1

def mask_mail(mail):
    """
    Mask email address to avoid spamming.
    """

    mail = mail.replace("@", " [at] ")
    return mail

def email_msg(smtp_username, smtp_password, recipient, msg):
    """
    Send an email using gmail.com.
    """

    server = smtplib.SMTP()
    server.connect("smtp.gmail.com", 587)
    server.starttls()
    server.ehlo()
    server.login(smtp_username, smtp_password)
    server.sendmail(smtp_username, recipient, msg)

def add_line_to_file(file_path, search_line, line_to_insert):
    """
    Search text file and insert line.
    """

    # Make sure the file here is readable and writable.
    with open(file_path, "r+") as f:
        lines = f.readlines()
        i = lines.index(search_line)
        lines.insert(i + 1, line_to_insert)
        f.seek(0)
        f.truncate()
        f.write("".join(lines))

# Oh dear. We can't find config.
if not os.path.isfile(CONFIG):
    sys.exit()

# Act like a valid page.
print "Content-Type: text/html"
print
print "<(^^)>"

# Grab the POST values.
form = cgi.FieldStorage()
perpetrator_address = form.getvalue("perpetrator_address")
perpetrator_message = form.getvalue("perpetrator_message")
victim_name = form.getvalue("victim_name")
victim_address = form.getvalue("victim_address")

if not perpetrator_message:
    perpetrator_message = "-"

# Grab the config values.
smtp_username = config_section_map("Flowers")["smtp_username"]
smtp_password = config_section_map("Flowers")["smtp_password"]
md_file = config_section_map("Flowers")["file_to_edit_path"]
wall_of_shame_url = config_section_map("Flowers")["wall_of_shame_url"]

# Wrong request, abort operation.
if not perpetrator_address \
  or not victim_name \
  or not victim_address \
  or not smtp_username \
  or not smtp_password \
  or not md_file \
  or not wall_of_shame_url or \
  len(perpetrator_message) > 200:
    sys.exit()

# Author the message to send.
msg = "From: flowers@security-class.gr\nTo: %s\nSubject: Ξεκλείδωτος Η/Υ\n\nΓεια σου %s, " \
      "\n\nΑπ' ότι φαίνεται ο κάτοχος της διεύθυνσης %s έστειλε ένα email \nαπό τον υπολογιστή σου, " \
      "προσθέτοντάς σε στον τοίχο της ντροπής: \n\n%s\n\nΣε συμβουλεύουμε να κλειδώνεις τον υπολογιστή " \
      "σου κάθε φορά που \nαπομακρύνεσαι από αυτόν ώστε να μην μπορεί να τον " \
      "χρησιμοποιήσει κανείς άλλος." % (victim_address, victim_name, perpetrator_address, wall_of_shame_url)

# Connect to gmail and mail the message.
email_msg(smtp_username, smtp_password, victim_address, msg)

# Update the md file with the new record.
search_line = '<!--- store after this -->\n'
line_to_add = "<li><h2>%s</h2>\n\t<p>Επιτιθέμενος: %s</p>\n\t<p>Μήνυμα: " \
              "%s</p>\n\t<p>Κατοχυρώθηκε: %s</p>\n</li>\n" % \
              (mask_mail(perpetrator_address), mask_mail(victim_address), perpetrator_message, \
              strftime("%Y-%m-%d %H:%M:%S", gmtime()))

add_line_to_file(md_file, search_line, line_to_add)
