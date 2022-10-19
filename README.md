# Airi

Airi is a discord utility bot originally built for a personal server between myself and some friends.

Presented here is a bare bones version of Airi as a portfolio project.

# PLEASE NOTE

To protect the privacy of those who are involved, many database this program relies on has been redacted. 

As such, this program will NOT work (there will be syntax errors and components missing) as is, only the core algorithms and logics have been kept as a showcase project. Please don't try to run this.

# Key Functionalities

## ImageNet
Takes user image and inputs it into a pretrained machine learning model (MobileNet v2, via TensorFlow-JS) to determine the image, outputs different likelihoods of the image.

## GameLogs
Using "status" on Discord, log user time in different game applications. Each session is recorded. For now, only basic output is supported, but new output features are planned to be included in a future version.

## Where
This function finds if a certain person has talked in the Discord server in the last while, and outputs their status and last message. This was extended in "whereall" to find where everyone within the group was.




# Other Basic Functionalities

## Basic Chatting
Airi supports basic chatting functionalities, such as saying good morning and good night with custom profiles for different people. Many commands are also implemented such that they can be invoked using chat commands.

## Help
Sends helpfile.

## Ping
Tests ping to the chatbot.

## Say
Replicate user input.

## Admin
Basic admin utilities

