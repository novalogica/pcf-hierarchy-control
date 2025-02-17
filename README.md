# Hierarchy Control

| ![Hierarchy Control](https://github.com/novalogica/pcf-hierarchy-control/blob/main/screenshots/pcf-hierarchy-control.jpg?raw=true) |
|:--:|
| *Figure 1: Hierarchy Control displaying a sample hierarchy.* |

This **PowerApps Component Framework (PCF)** control is designed to replace the deprecated hierarchy control in Dynamics 365. It offers enhanced functionality and flexibility, allowing users to visualize and interact with hierarchical data in a more dynamic and user-friendly way. 

- **Universal Compatibility**: Works with any entity that has an active hierarchy-type relationship.
- **Customizable Display**: Displays all columns from the selected card form, enabling users to choose which fields to display.
- **Lookup Support**: Supports lookup fields, enabling users to click and navigate to related records.
- **Dynamic Node Cards**: Displays multiple columns on node cards, with expand/collapse functionality to show or hide child nodes.
- **Side Panel with Tree View**: Includes a collapsible side panel with a tree component for easy navigation. Clicking a node in the tree centers it in the main view.
- **Interactive Hierarchy Chart**: The hierarchy chart can be fully expanded, collapsed, and moved around for better visibility.
- **Zoom Controls**: Includes zoom functionality (scroll or dedicated controls) for easier navigation of large hierarchies.

---

## 📌 Features

### **Dynamic Node Cards**
- Node cards are dynamically generated based on the selected columns from the form.
- Users can expand or collapse nodes to show or hide child nodes, making it easier to navigate complex hierarchies.

| ![Dynamic Cards](https://github.com/novalogica/pcf-hierarchy-control/blob/main/screenshots/pcf-hierarchy-card.jpg?raw=true) |
|:--:|
| *Figure 2: Cards can display multiple columns, providing a comprehensive overview of each node* |


### **Side Panel with Tree View**
- The side panel provides a tree view of the hierarchy, allowing users to quickly navigate and locate specific nodes.
- Clicking a node in the tree centers it in the main view, ensuring it is visible and focused.
- The side panel can be collapsed to maximize the space for the hierarchy chart.

### **Interactive Hierarchy Chart**
- The hierarchy chart is fully interactive, allowing users to expand, collapse, and move nodes around for better visibility.
- Zoom controls (or scroll) enable users to focus on specific sections of the hierarchy, making it easier to navigate large datasets.

### **Lookup Support**
- Lookup fields are fully supported, allowing users to click and navigate to related records directly from the hierarchy view.
- This feature enhances usability by providing quick access to related data.

### **Additional Notes**
- **Compatibility**: This control is compatible with any entity that has an active hierarchy-type relationship.
- **Performance**: The control is optimized for performance, ensuring smooth navigation even with large hierarchies.
- **Customization**: The control is highly customizable, allowing users to choose which fields to display and how the hierarchy is visualized.

---

## Hierarchy Indicator Control (Optional)

| ![Hierarchy Indicator](https://github.com/novalogica/pcf-hierarchy-control/blob/main/screenshots/pa-hierarchy-grid-control.png?raw=true) |
|:--:|
| *Figure 3: Hierarchy Indicator control displaying hierarchy indicator for all account records.* |

If you want to maintain the legacy feature of checking if a record has a hierarchy and opening it within the view, providing a seamless transition for users, you can add this bundled control to the entity views.

- **Hierarchy Indicator**: Displays an icon embedded at the start of the primary column value in the view to indicate the presence of a hierarchy.
- **Seamless Integration**: Clicking this icon opens the main Hierarchy PCF control, ensuring a smooth user experience.

### How to Add Control to Entity View?
1. Open the desired view in Dynamics 365.
2. Add a component by selecting **PowerApps Grid Control**.
3. Choose the **Customizer Control** and select **nl_novalogica.PAHierarchyGrid**.

| ![Hierarchy Indicator](https://github.com/novalogica/pcf-hierarchy-control/blob/main/screenshots/pcf-hierarchy-grid-configuration.png?raw=true) |
|:--:|
| *Figure 4: Hierarchy indicator control configuration* |

### Is the Hierarchy Indicator Control mandatory?
No, this control is completely optional. If you only need the main hierarchy control, you can open it directly using a **pageType=Control** URL, similar to how the deprecated Microsoft control functioned.

---

## 🚀 Configuration

### **Step-by-Step Setup**
1. **Download the Solution**: Download the bundled solution file containing both the Hierarchy and Hierarchy Indicator PCF controls.
2. **Import the Solution**: Import the solution into your Dynamics 365 environment.
4. **Add the Hierarchy Indicator Control (Optional)**: Add the PowerApps Component customizer to the view to enable the hierarchy indicator feature.
5. **Open Hierarchy Control from a Ribbon Button (Optional)**: Use the following JavaScript code to open the Hierarchy control from a ribbon button:

```javascript
var paneInput = {
    pageType: "control",
    controlName: "nl_novalogica.HierarchyPFControl",
    data: { etn: "account", id: "0000-000-0000000-000" }
};

var navigationOptions = {
    target: 2,
    position: 1
};

Xrm.Navigation.navigateTo(paneInput, navigationOptions).then(
    function success() {
        // Run code on success
    },
    function error() {
        // Handle errors
    }
);
```

---


## Contributions
Contributions to improve or enhance this control are welcome. If you encounter issues or have feature requests, please create an issue or submit a pull request in the repository.

---

## License
This control is licensed under the MIT License. See the [LICENSE](https://github.com/novalogica/pcf-hierarchy-control/blob/main/LICENSE) file for details.
