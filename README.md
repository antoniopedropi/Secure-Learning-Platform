# Project Resources

Welcome to the project directory. This repository contains the source code for a Secure Learning Platform, a semester project developed for the "Security in Software Engineering" course at the Faculty of Sciences, University of Porto.

The project aims to build a robust online course management system that integrates security best practices from the beginning of the development lifecycle (following the "Shift Left" and DevSecOps principles) rather than treating security as an afterthought. 

Below are the key resources available:

## 📂 Contents

- **📊 Presentation**: Our project presentation can be found [here](./presentation.pdf). We also uploaded the presentation in the .pptx format.
- **📑 Report**: The detailed project report is available [here](./report_PT.pdf).
- **💻 Source Code**: Explore the full source code [here](./src).

Feel free to navigate through these files to get a comprehensive understanding of our project.

In order to run our app, change directory to the scr folder, and run the following command to load the server and its components:

``` bash
python -m uvicorn app.main:app --reload
```

Afterwards, run the following commands to run the frontend part of our application:

``` bash
cd frontend 
npm i 
npm start
```
