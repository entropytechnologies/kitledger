# Kitledger Style Guide

This document outlines the primary coding style and naming conventions used in the Kitledger project. Adhering to these guidelines helps maintain code consistency, readability, and maintainability across the codebase.

## Naming Conventions

The following naming conventions are to be used for their respective categories:

### 1. Functions, Variables, and `const` Declarations

* **Convention:** `camelCase`
* **Applies to:** Function names, local variable names, and `const` declarations that are not global, fixed constants.
* **Examples:**
    * Function: `function calculateBalance(entries) { /* ... */ }`
    * Variable: `let userName = "guest";`
    * Constant: `const defaultTimeout = 5000;`

### 2. Filenames

* **Convention:** `snake_case`
* **Applies to:** All TypeScript (`.ts`) and other source files.
* **Examples:**
    * `account_actions.ts`
    * `entity_model_validation.ts`
    * `database_connection.ts`

### 3. Classes, Type Aliases, Interfaces, Enums, and Namespace Objects

* **Convention:** `PascalCase`
* **Applies to:** Class definitions, custom type aliases, interface definitions, enum definitions, and exported constant objects that serve as namespaces for related functions (e.g., collections of actions or services).
* **Examples:**
    * Class: `class UserProfile { /* ... */ }`
    * Type Alias: `type AccountId = string;`
    * Interface: `interface TransactionDetails { /* ... */ }`
    * Enum: `enum BalanceType { Debit, Credit }`
    * Namespace Object: `export const AccountActions = { create: /* ... */, ... };`

---

*This style guide is a living document and will be expanded with more specific guidelines as the Kitledger project evolves.*