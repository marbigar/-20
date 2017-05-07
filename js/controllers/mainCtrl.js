app.controller('mainCtrl', mainCtrl);
mainCtrl.$inject = ['$scope', 'TaskService'];

function mainCtrl($scope, TaskService) {

    $scope.formHidden = true;
    $scope.order = '';
    $scope.tasks = [];

    $scope.refresh = function() {
        $scope.tasks = TaskService.getTasks()
            .then(function (response) {
                $scope.tasks = response.data;
            });
    };
    $scope.refresh();

    $scope.add = function() {
        $scope.addBlock.status = 'В процесі';
        TaskService.addTask($scope.addBlock).then(function() {
            $scope.refresh();
        });
        $scope.addBlock = {};

    };

    $scope.delete = function(id) {
        TaskService.deleteTask(id).then(function() {
            $scope.refresh();
        });
    };

    $scope.check = function(id, checkedStatus) {
        if ( checkedStatus ) {
            TaskService.checkTask(id).then(function() {
                $scope.refresh();
            });
        } else {
            TaskService.uncheckTask(id).then(function() {
                $scope.refresh();
            });
        }
    };

    $scope.edit = function(task) {
        $scope.formHidden = false;
        $scope.editText = task.title;
        $scope.editId = task.id;
    };

    $scope.editSave = function() {
        id = $scope.editId;
        text = $scope.editText;
        TaskService.edit(id, text).then(function() {
            $scope.refresh();
        });
        $scope.formHidden = true;
    };

}