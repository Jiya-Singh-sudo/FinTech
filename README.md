#FinTech
# 🛡️ Guardia — End-to-End FinTech Fraud Detection Platform

Guardia is a full-stack fraud detection and transaction analytics platform designed to process noisy, real-world financial data at scale. The system combines advanced data cleaning, behavioral feature engineering, machine learning, and interactive visualization to identify potentially fraudulent transactions and provide explainable risk insights.

Built with **FastAPI**, **Next.js**, **Supabase**, and modern ML frameworks, Guardia simulates the challenges of production banking systems where data is often incomplete, inconsistent, and affected by schema drift.

---

## 🎯 Problem Statement

Financial fraud detection is rarely performed on perfectly structured datasets. Real-world transaction streams contain:

* Missing and corrupted values
* Inconsistent timestamp formats
* Duplicate records
* Geographic naming variations
* Mixed currency and amount formats
* Invalid network metadata

Guardia addresses these challenges through an end-to-end pipeline that transforms raw transaction logs into actionable fraud predictions and business insights.

---

## 📊 Dataset Overview

* **100,000+ transactions**
* **2,000+ unique users**
* **2 years of transactional history**
* Multiple payment channels, devices, and geographic locations

The platform builds user-level behavioral baselines and detects anomalies based on spending patterns, transaction velocity, location changes, and device usage.

---

## 🔍 Key Data Engineering Challenges Solved

### Amount Standardization

Normalizes transaction values across formats such as:

```text
₹3,200
Rs 3200
3200 INR
3200.0000
```

Supports fallback reconciliation using alternate amount fields.

### Timestamp Normalization

Parses and standardizes multiple datetime representations:

```text
1708320459
2024-02-14T07:27:39
February 14, 2024 07:27 AM
05-Feb-2024
```

### Location Canonicalization

Maps inconsistent location representations into a unified format:

```text
Mumbai
mumbai
Bombay
BOM
```

### Data Integrity Validation

* Duplicate transaction detection
* Transaction ID collision analysis
* Missing value auditing
* Invalid IP address validation

---

## 🏗️ System Architecture

```text
Raw Transactions
        │
        ▼
Data Cleaning & Validation
        │
        ▼
Exploratory Data Analysis
        │
        ▼
Feature Engineering
        │
        ▼
Fraud Detection Model
        │
        ▼
Explainability Layer
        │
        ▼
Interactive Dashboard
```

---

## ⚙️ Fraud Detection Pipeline

### 1. Data Cleaning

* Missing value handling
* Datatype correction
* Timestamp parsing
* Location normalization
* Network validation

### 2. Exploratory Data Analysis

* User spending behavior
* Payment method distribution
* Device usage trends
* Geographic transaction patterns

### 3. Feature Engineering

Features include:

* Transaction velocity
* Spending spikes
* Device switching frequency
* Location consistency
* Historical balance deviations
* User behavioral profiling

### 4. Machine Learning

Models can be trained using:

* Scikit-Learn
* LightGBM
* XGBoost

Evaluation focuses on:

* Precision
* Recall
* F1 Score
* Fraud detection effectiveness

### 5. Explainability

Provides interpretable predictions using feature importance analysis and explainability frameworks such as SHAP and LIME.

---

## 💻 Tech Stack

### Backend

* FastAPI
* Python
* Pandas
* NumPy
* Scikit-Learn
* LightGBM / XGBoost

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Database & Auth

* Supabase

---

## 🔌 API Endpoints

| Endpoint        | Description                       |
| --------------- | --------------------------------- |
| `/predict`      | Fraud prediction service          |
| `/transactions` | Transaction retrieval & filtering |
| `/fraud`        | Fraud analytics & statistics      |
| `/results`      | Model outputs and reporting       |

---

## 🚀 Getting Started

### Prerequisites

* Python 3.10+
* Node.js 18+
* Supabase Project

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API available at:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Frontend available at:

```text
http://localhost:3000
```

---

## 🌟 Highlights

* End-to-end fraud detection workflow
* Real-world data quality remediation
* Advanced behavioral feature engineering
* Explainable machine learning predictions
* FastAPI microservice architecture
* Interactive analytics dashboard
* Production-oriented system design
