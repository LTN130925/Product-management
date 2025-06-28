const tablePermission = document.querySelector('[table-permission]');

if (tablePermission) {
  const buttonSubmit = document.querySelector('[button-submit]');
  const dataTable = tablePermission.querySelectorAll('[data-name]');


  buttonSubmit.addEventListener('click', () => {
    const permission = [];

    dataTable.forEach((item) => {
      const dataName = item.getAttribute('data-name');
      const inputs = item.querySelectorAll('input');
      console.log(inputs);
      if (dataName === 'id') {
        inputs.forEach(input => {
          permission.push({
            id: input.value,
            permission: []
          });
        })
      } else {
        inputs.forEach((input, index) => {
          if (input.checked) {
            permission[index].permission.push(dataName);
          }
        });
      }
    });
    console.log(JSON.stringify(permission));
  });
}