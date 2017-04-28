# Network & Cloud Computing - Final Project (Part one - Cloud deployment)

## What does the project contain?
> It is a node project for posting and viewing sale ads by various users. 
> It also contains the installation steps, configurations required and the scripts to create a deployment of Node.js application on Google Compute Engine

## What is the environment being used?
> Google Cloud Engine(Google Compute Engine), Node and Mongo DB(external service from MLab)

## System requirement and setup
- Create Project on Google Cloud Platform
- Enable billing in Developer's console
- Debian-based virtual machine
- Google Cloud Shell activation to follow script
- [PROJECT_ID] from Home -> Dashboard

## Project Structure
- The project conatins an app.js to run the node application
- config.js holds all the configurations, connectionss and environment
- ads folder contains the js files for db logic and actions logic
- views contain the front end components
- package.json defines libraries to install using npm
