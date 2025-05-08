const fetchEmployees = async () => {
  try {
    const res = await axios.get('http://localhost:8000/propel/employees/', {
      params: {
        order: 'descending',
        field: 'gcb',
        condition: 'gt',
        value: 4,
        include_special_leads: false,
        functional_manager_flow: false
      }
    });
    console.log(res.data.data);
  } catch (err) {
    console.error(err);
  }
};
