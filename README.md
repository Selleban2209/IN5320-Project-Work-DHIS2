# Project work
This is project i did for a unversity course alongside 4 other team members that involves the use of the DHIS2 platform to build a web application based on a case in managing, dispensing and ogranizing medical stocks. This solution also includes managment of users and medical staff.


# DESCRIPTION OF DHIS2

DHIS2 is a cost-free software platform offering open-source development services. Developed by the HISP Centre at UiO, it primarily serves as an information system for health management. DHIS2 can be used to handle data management and analysis for various purposes. You can find additional details about the DHIS2 platform on [this](https://dhis2.org/about/) website.

# PRE-REQUISITES

Node and yarn have to be installed on your computer to set up the application. They can be installed following the [node.js setup guide](https://dhis2-app-course.ifi.uio.no/learn/getting-started/development-setup/nodejs/).
Following this, the DHIS2 dependencies have to be installed. To install them globally, one can run the following command:

```
yarn global add @dhis2/cli
```

Moreover, many web browsers will need a request to an external resource, specifically our DHIS2 instance. We achieve this through the dhis-portal tool, which can be set up by executing the provided command:

```
yarn global add dhis-portal
```

# FIRST TIME SETUP

Make sure to import all the necessary dependencies:

```
yarn install
```

Set up the DHIS2 proxy:

```
npx dhis-portal --target=https://data.research.dhis2.org/in5320/
