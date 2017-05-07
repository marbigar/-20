app.factory("TaskService", function($http) {

    return {
        getTasks: function() {
            return $http.get('http://localhost:8080/get-tasks');
        },
        deleteTask: function(id) {
            return $http.post('http://localhost:8080/delete-task', {id: id});
        },
        addTask: function(task) {
            return $http.post('http://localhost:8080/add-task', task);
        },
        checkTask: function(id) {
            return $http.post('http://localhost:8080/check-task', {id: id, status: 'Завершено'});
        },
        uncheckTask: function(id) {
            return $http.post('http://localhost:8080/uncheck-task', {id: id, status: 'В процесі'});
        },
        edit: function(id, text) {
            return $http.post('http://localhost:8080/edit-task', {title: text, id: id});
        }
    }
});

// var tasks = [
//     {
//         id: 1,
//         title: "Сходити в зал",
//         status: "В процесі",
//         checked: false
//     },
//     {
//         id: 2,
//         title: "Сходити в магазин",
//         status: "В процесі",
//         checked: false
//     },
//     {
//         id: 3,
//         title: "Зробити ДЗ",
//         status: "В процесі",
//         checked: false
//     },
//     {
//         id: 4,
//         title: "Приготувати їсти",
//         status: "В процесі",
//         checked: false
//     }
// ];
