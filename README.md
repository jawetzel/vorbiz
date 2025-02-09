# VorBiz

## Overview
A mobile application designed specifically for micro businesses operating at pop-up venues like Farmers Markets. The app simplifies sales recording and reporting, helping small vendors track their business performance without complex POS systems. Focused on ease of use and offline capabilities, it enables vendors to record sales quickly during busy market hours and generate reports for business insights.

## Project Goals
- [ ] Goal 1: Match or exceed the speed and ease of paper-based sales recording, measured through real vendor usage testing
- [ ] Goal 2: Automate daily sales summaries and monthly sales tax reporting, eliminating manual calculations
- [ ] Goal 3: Ensure 100% functionality without internet connection, including sales recording and report generation

## Phase 1 Features (Current)
1. Business Setup Configuration
   - Create and manage market locations with their specific tax rates
   - Product management:
     - Define product catalog with details (prices, descriptions, categories)
     - Assign/manage UPC or custom barcodes for products
     - Configure quick-access buttons for frequently sold items
     - Generate printable QR/barcode reference sheets
     - Group products for efficient reference sheet creation
   - All configuration stored locally for offline access
   - Essential for accurate sales recording and tax calculations

2. Sales Transaction Recording
   - Multiple product selection methods:
     - Hierarchical searchable dropdown system:
       - First dropdown: Search by category or product name
       - Results grouped by categories for easy scanning
       - Real-time filtering as user types
     - Variation handling:
       - Second dropdown appears for products with variations
       - Search/select size, color, material, or other attributes
       - Only shows relevant variations for selected product
     - Barcode/QR code scanning via device camera
     - Quick-access buttons for common items
   - Quick location selection for correct tax rates
   - Multi-line item support within single transaction
   - Automatic tax calculation based on location and product data
   - Real-time total calculation including tax
   - Offline storage of complete transaction data

3. Sales Tax Reporting
   - Monthly tax obligation reports
   - Breakdown by state and local jurisdictions
   - Format matched to tax filing requirements
   - Easy-to-copy numbers for direct entry into tax forms
   - Available offline with current data
   - Historical report access

4. Business Analytics
   - Daily sales summaries for end-of-day reconciliation
   - Product performance reports by date range
   - Location performance analysis by date range
   - Customizable date ranges for all reports
   - Exportable report formats
   - Offline access to all reporting features

5. Data Export & Integration
   - Comprehensive raw data export
   - Line-item level detail for each sale
   - Complete location and product details included
   - Transaction timestamps and IDs
   - Tax calculation breakdowns
   - Export format suitable for external analysis

6. AI Marketing Assistant
   - Generate targeted social media content
   - Analyze historical sales patterns by location
   - Incorporate local demographic data
   - Predict best-selling products for specific venues
   - Suggest optimal product mix
   - Create location-specific marketing messages
   - Schedule-aware content generation

7. Recipe & Cost Management
   - Input raw ingredient costs and quantities
   - Define recipes with ingredient proportions
   - Calculate per-unit production costs
   - Track ingredient price changes over time
   - Batch scaling calculations
   - Profit margin analysis
   - Cost trend monitoring

## Phase 2 Features (Future Online Capabilities)
1. Business & User Management
   - Business account creation and management
   - Two-tier role system:
     - Manager: Full access to all features including setup, reporting, and sales
     - Salesman: Restricted to sales transaction recording only
   - User invitation and onboarding system
   - Secure authentication and login
   - Device management per user

2. Multi-Device Synchronization
   - Real-time data sync between all devices in a business
   - Personal multi-device sync for individual users
   - Conflict resolution for offline changes
   - Selective sync options for different data types
   - Bandwidth-efficient sync protocol

3. Payment Processing
   - Integration with third-party payment processor
   - Tap-to-pay functionality
   - Manual card number entry
   - Digital receipts
   - Payment reconciliation
   - Transaction history and reporting
   - Offline payment processing capability

4. Cloud Infrastructure
   - Secure cloud storage
   - Automated backups
   - Version history and change tracking
   - Data recovery options
   - Cross-platform compatibility

5. Subscription Service
   - Tiered pricing models
   - Payment processing
   - Account management
   - Usage monitoring

6. Enhanced Features
   - Real-time data analytics
   - Cross-business insights
   - Advanced reporting capabilities
   - Integration with other business tools
