
# Personal Finance Visualizer

## Overview

The *Personal Finance Visualizer* is a web-based application designed to help users track their personal finances in an easy-to-understand manner. The app allows users to add and manage transactions, categorize their expenses, visualize monthly spending trends, and view financial summaries such as total expenses, category breakdowns, and recent transactions. 

This project is built using **Next.js**, **React**, **MongoDB**, and other modern technologies to provide a smooth user experience for personal finance management.

## Features Implemented So Far

### 1. **Transaction Management**
- Users can add transactions, including details such as the amount, description, and date.
- Transactions are saved to a **MongoDB database** and can be retrieved for display.
  
### 2. **Transaction List Display**
- A list of all transactions is displayed, with details such as the transaction amount and description.
- Users can view, edit, or delete transactions.

### 3. **Category Management for Transactions**
- Users can categorize their transactions to help with expense tracking.
- Categories are displayed in a **dropdown** menu when adding or editing a transaction.

 ### 4. **Add/Edit/Delete Functionality for Categories**
- Currently, users can select categories when adding or editing transactions. However, adding, editing, or deleting categories is not yet functional.


### 5. **Dashboard Overview**
- The dashboard displays the following:
  - **Total Expenses** for the current period.
  - **Recent Transactions** for quick insights.
  - **Category Breakdown** (coming soon) of expenses.

### 6. **Monthly Expenses Bar Chart**
- A **Monthly Expenses Bar Chart** is being integrated using **Recharts** to visualize the monthly expense data.
- The data for this chart is fetched from the API and processed for display.
  
### 7. **Basic Form Validation**
- Basic validation has been implemented for the transaction forms to ensure data integrity (e.g., preventing empty values).

## Pending Features

### 1. **Add Category-Wise Pie Chart**
- The goal is to implement a **Pie Chart** that shows the breakdown of expenses by category.
- This feature is partially implemented but needs further data extraction and chart rendering refinement.

### 2. **Transaction Editing and Deleting**
- Users can edit or delete transactions, but the backend logic for deleting and updating transactions is still under development.

### 3. **Monthly Expenses Breakdown**
- The functionality to visualize the monthly breakdown of expenses (e.g., in a bar chart or line graph) is partially implemented but needs further improvements.
  
### 4. **Error Handling and State Management**
- Although some basic error handling has been implemented, more robust state management for various operations (such as adding and updating transactions) is still a work in progress.

## Technologies Used

- **Next.js** - Framework for building the application.
- **React** - For creating the UI components.
- **MongoDB** - To store and manage user data and transactions.
- **Recharts** - For visualizing the financial data in charts.
- **Multer** - For handling image uploads (if applicable).
- **Node.js** - For running the server-side logic.
- **Express** - Web server to handle requests.

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- **Node.js** and **npm** (or **yarn**)
- **MongoDB** (either locally or using a cloud service like MongoDB Atlas)

### Install Dependencies

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/KrishnendhuVinod/personal-finance-visualizer.git
