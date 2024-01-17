# IN5320-PROJECT FOR GROUP 31:

- Naser Abdelmaguid, naserab
- Benjamin Borge, benjabor
- Madin Cej, madinc
- Selleban Farah, sellebaf
- Shahvez Mahmood, shahvezm

The application is created using the [DHIS2 Application Platform](https://github.com/dhis2/app-platform), a framework for building DHIS2 applications. While it's not necessary to watch the video for setting up or running the application, it provides additional insights into DHIS2 application development. You can find more details about the platform and an introduction to application development in DHIS2 in the video linked [here](https://www.youtube.com/watch?v=WP6ZWbsTz-Q&list=PLo6Seh-066Rze0f3zo-mIRRueKdhw4Vnm&index=4).

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
```

Start the application by running the following command in the project directory:

```
yarn start
```

Your browser should then open up a DHIS2 instance on localhost:3000. The login credentials are:

```
Server: localhost:9999
Username: admin
Password: district
```

# APP-FUNCTIONALITY

We have implemented the three fundamental requirements:

- Store managers must be able to register when a commodity is dispensed, with the information described above.
- The data set “Life-Saving Commodities” in the DHIS2 instance must be updated, meaning adding to the consumption, and subtracting from the end-balance of the current month.
- The application should retrieve the listed commodities from the “Life-Saving Commodities” data set. If new commodities are added to the data set, these should be available in your application.

Adding to the fundamental requirements, we also implemented five additional requirements:

- Store management (1)
  - develop an interface that supports efficiently updating stock balances when dozens of different commodities are received at the medical store
  - the data set “Life-Saving Commodities” should be updated, and a stock replenishment “transaction” should be recorded
- Requests commodities from nearby clinics (3)
  - provide store managers with an overview of available stocks in nearby clinics, to help identify where there is potential for receiving a transfer
- Improved management of commodity recipients (4)
  - develop a solution that allows medical personnel and hospital departments to be stored/persisted in the database, to be used as “recipients” during commodity dispensing
  - the functionality to persist names/departments should be integrated in the function to register when a commodity is dispensed
- Stock recounts (5)
  - develop a solution tailored for a physical stock recount workflow
  - the data set “Life-Saving Commodities” should be updated, and a stock recount “transaction” should be recorded for discrepancies
- Manage bulk operations (9)
  - develop support for bulk operations to verify and dispense multiple commodities

# IMPLEMENTATION

For this part, we are briefly going to present the implementation of each tab in the app.

### Overview

The Overview component designed for displaying and managing medicine inventory in a DHIS2-based application. It imports necessary React hooks and elements from the dhis2 library, including DataTable, Button, and NoticeBox. The component, taking activePageHandler and medicineData as props, manages the sorting of medicine data with states like sortedData and sortConfig. A useEffect hook ensures the inventory display is updated based on sorting preferences. The UI features a NoticeBox for guidance and a DataTable for listing medicines, with interactive headers for sorting by name, amount, or consumption. Each row in the table includes action buttons for dispensing medicine or viewing nearby clinics stock amount of the same medicine, linked to the activePageHandler for navigation within the application. This component simplifies real-time medicine inventory management and viewing.

### Recieve commodities

This component is a part of the DHIS2-based application designed to fulfill additional requirements for Store Management (1). It shares the display of the datatable with the `Stock Recount` component and uses hooks to manage dynamic data efficiently. As per the requirements, the main function of the component is to enable users to log newly arrived stock of commodities on a monthly basis. The input will update the end balance in the API and store the new stock in the data store. There is reason to assume that not every commodity may come monthly, and for that reason only one commodity needs to be submitted for it to go through. Whether the submission is successful or unsuccessful, an alert using the DHIS2 UI library will be shown accordingly. If the user tries to submit with an empty input field, an alert will appear informing them that submission is not allowed and prompting them to fill in the input field.

The transaction history can be accessed from this component clicking on the `History` button on the top corner. Transaction history for store management can also be found in the `Transaction History` tab. In this component we present data about commodities, including the date of submission, the person managing the submission, the previous amount of commodities at the time, the new amount of commodities at the time, and the option to show details. Clicking on `Show Details` will present the name of the commodities that got added, the previous stock, the added stock, and the total stock.

### Dispense

The Dispensing Commodities feature is designed to seamlessly integrate with external APIs and allowing for dispensing in bulk operations. A form is displayed, featuring two select fields for choosing the commodity and recipient, along with the amount to be dispensed. By clicking the `Add item` button, the selected commodity is appended to a list of items earmarked for dispensing. This list which is displayed, allowes users to remove and add multiple items as necessary. When When the dispensing process is initiated which is done so by pressing the `Dispense Commodities` button, the application processes the list, sending the commodities to the API. This action results in a deduction from the end balance amount and adding to the ammount consumed of said commodities. On Successful communication with the DHIS2 API triggers the subsequent transmission of data to the Datastore database. Users can conveniently view the recorded data, with the three most recent dispensing transactions displayed at the bottom of the page. Additionally, a comprehensive transaction history tab captures all dispensing activities, providing users with an overview of commodity transactions.

### Stock Recount

The stock recount component is a part of our DHIS2-based application designed to function as a quarterly stock management process.
This React component uses hooks like “useState”, “useDataQuery” and “useDataMutation” to manage dynamic data efficiently.
The primary goal of stock recount is for users to be able to log a quarterly update fast and efficient.
The system will also compare with previous quarterly updates so the user can easily spot the difference.
The user interface of the component is designed to be simple and ease of use, it features a “NoticeBox” for clear instructions and a “StockDataTable” for inputting new stock values with each quarterly update.
The submit button handles data validation and synchronization of updated stock information with the DHIS2 datastore.
To access the most recent submission or review previously submitted quarterly updates, users can navigate to the History tab.
Here, each quarterly update is logged, offering the functionality to delve into more detailed information about specific quarterly updates.
This feature ensures a comprehensive and accessible historical record for efficient tracking and analysis.
The component also features error handling and user feedback mechanisms, utilizing “AlertBar” to communicate success or critical alerts to the user.
This implementation improves the efficiency of the stock recount process, making it a useful tool for store managers in their quarterly stock recount tasks.

### Staffing

The Staffing.js component for a DHIS2-based application, focusing on managing staff information. It imports essential React hooks and DHIS2 UI components, including useState, useDataMutation, and useStaffing. The component features a getDataStoreMutationQuery function for constructing datastore mutation queries. The component initializes state variables and uses custom hooks for data fetching and mutation. It handles form submissions with an `onSubmit` function, ensuring data integrity and providing user feedback through alert messages.The user interface includes a NoticeBox for instructions, a form with DataTable and InputFieldFF for inputting Staff Name and Department, and a submission `Button`. Success or error feedback is communicated via an `AlertBar`. The submitted staff is then available in dispensing.

# ERRORS AND OMISSIONS

We aimed to have the dispense button, associated with each medicine, automatically populate the commodity field in the Dispense form upon being clicked. To achieve this, we passed the medicine id as a prop. However, despite verifying through console logs that the two `id`s matched, they did not seem to synchronize as expected. We suspect the issue might stem from the <SingleSelectField> component, which could be affecting the intended matching of the id's.
