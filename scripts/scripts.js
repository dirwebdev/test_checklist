// This code will run after the entire page is loaded
document.addEventListener('DOMContentLoaded', (event) => {
  // Selecting the sidebar and the content area where we want to load our pages
  const sideBar = document.querySelector('#section-02 .sidebar');
  const contentArea = document.querySelector('#section-02 .content-area');

  // This is the structure of our sidebar
  const sidebarContent = [
      { title: 'list_01', subItems: ['sub_list_01', 'sub_list_02', 'sub_list_03'], page: 'list_01.html', tasks: 'tasks-01.json' },
      { title: 'list_02', subItems: ['sub_list_04', 'sub_list_05', 'sub_list_06'], page: 'list_02.html', tasks: 'tasks-02.json' },
      { title: 'list_03', subItems: ['sub_list_07', 'sub_list_08', 'sub_list_09'], page: 'list_03.html', tasks: 'tasks-03.json' },
  ];

  // Keep track of menus and submenus for toggling
  const menus = [];

  // Iterating over each item in the sidebar
  sidebarContent.forEach(item => {
      // Creating a new HTML element for each menu item
      const menuItem = document.createElement('div');
      menuItem.innerHTML = `<h3>${item.title} <span class="arrow">&#9660;</span></h3>`;
      sideBar.appendChild(menuItem);

      // Load the associated HTML file when the menu item is clicked
      menuItem.addEventListener('click', () => {
          fetch(`pages/${item.page}`)
              .then(response => response.text())
              .then(data => {
                  contentArea.innerHTML = data;
              });
      });

      // Create a new HTML element for the sub menu
      const subMenu = document.createElement('div');
      subMenu.style.display = 'none';
      menuItem.appendChild(subMenu);

      // Add menu item and sub menu to our list
      menus.push({menuItem, subMenu});

      // Iterate over each sub menu item
      item.subItems.forEach((subItem, index) => {
          const subMenuItem = document.createElement('div');
          subMenuItem.innerHTML = `<h4>${subItem} <span class="arrow">&#9660;</span></h4>`;
          subMenu.appendChild(subMenuItem);

          // Load the associated HTML file and tasks when the sub menu item is clicked
          subMenuItem.addEventListener('click', (e) => {
              e.stopPropagation();
              fetch(`pages/${subItem}.html`)
                  .then(response => response.text())
                  .then(data => {
                      contentArea.innerHTML = data;

                      // Fetch tasks from JSON
                      fetch(`scripts/${item.tasks}`)
                          .then(response => response.json())
                          .then(json => {
                              const tasks = json.tasks;
                              tasks.forEach((task, index) => {
                                  // Create checkbox
                                  const checkbox = document.createElement('input');
                                  checkbox.type = 'checkbox';
                                  checkbox.id = `checklist-${subItem}-task-${index}`;
                                  checkbox.checked = localStorage.getItem(checkbox.id) === 'true';
                                  checkbox.addEventListener('change', (event) => {
                                      localStorage.setItem(event.target.id, event.target.checked);
                                  });

                                  const label = document.createElement('label');
                                  label.htmlFor = checkbox.id;
                                  label.appendChild(document.createTextNode(task));

                                  const br = document.createElement('br');

                                  contentArea.appendChild(checkbox);
                                  contentArea.appendChild(label);
                                  contentArea.appendChild(br);
                              });

                              // Reset button
                              const resetButton = document.createElement('button');
                              resetButton.innerHTML = 'Reset List';
                              resetButton.addEventListener('click', () => {
                                  tasks.forEach((task, index) => {
                                      localStorage.setItem(`checklist-${subItem}-task-${index}`, false);
                                      document.getElementById(`checklist-${subItem}-task-${index}`).checked = false;
                                  });
                              });

                              contentArea.appendChild(resetButton);
                          });
                  });
          });
      });

      // When a menu item is clicked, toggle its submenu and hide others
      menuItem.addEventListener('click', (event) => {
          // Prevent event propagation to avoid triggering the above event listener
          event.stopPropagation();

          // Toggle current submenu
          subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';

          // Change the arrow direction
          if (subMenu.style.display === 'none') {
              menuItem.querySelector('h3').classList.remove('expanded');
          } else {
              menuItem.querySelector('h3').classList.add('expanded');
          }

          // Hide other submenus
          menus.forEach(menu => {
              if (menu.subMenu !== subMenu) {
                  menu.subMenu.style.display = 'none';
                  menu.menuItem.querySelector('h3').classList.remove('expanded');
              }
          });
      });
  });

  // Master reset button
  const masterResetButton = document.createElement('button');
  masterResetButton.innerHTML = 'Master Reset';
  masterResetButton.addEventListener('click', () => {
      // Reset all items in local storage that start with 'checklist-'
      Object.keys(localStorage).forEach(key => {
          if (key.startsWith('checklist-')) {
              localStorage.setItem(key, false);
          }
      });

      // Also uncheck all currently displayed checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
          if (checkbox.id.startsWith('checklist-')) {
              checkbox.checked = false;
          }
      });
  });

  sideBar.appendChild(masterResetButton);
});
