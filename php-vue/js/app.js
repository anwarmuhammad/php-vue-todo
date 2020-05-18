
// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// localStorage persistence
var STORAGE_KEY = "todos-vuejs-2.0";
var todoStorage = {
	fetch: function() {
		var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

		todos.forEach(function(todo, index) {
			// todo.id = index;
			if(todo.completed){
				if(todo.completed == 0){
					todo.completed = false;
				}else if(todo.completed == 1){
					todo.completed = true;
				}
			}
		});
		todoStorage.uid = todos.length;
		console.log("localStorage");
		console.log("localStorage");
		return todos;
	},
	save: function(todos) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}
};

// visibility filters
var filters = {
	all: function(todos) {
		return todos;
	},
	active: function(todos) {
		return todos.filter(function(todo) {
			return !todo.completed;
		});
	},
	completed: function(todos) {
		return todos.filter(function(todo) {
			return todo.completed;
		});
	}
};

// app Vue instance
var app = new Vue({
	// app initial state
	mounted: function () {
		console.log("Vue.js is running...");
		this.getTasks();
	},

	data: {
		todos: todoStorage.fetch(),
		newTodo: "",
		editedTodo: null,
		visibility: "all",
	},

	// watch todos change for localStorage persistence
	watch: {
		todos: {
			handler: function(todos) {
				todoStorage.save(todos);
			},
			deep: true
		}
	},

	// computed properties
	// http://vuejs.org/guide/computed.html
	computed: {
		filteredTodos: function() {
			return filters[this.visibility](this.todos);
		},
		remaining: function() {
			return filters.active(this.todos).length;
		},
		allDone: {
			get: function() {
				return this.remaining === 0;
			},
			set: function(value) {
				this.todos.forEach(function(todo) {
					todo.completed = value;
				});
			}
		}
	},

	filters: {
		pluralize: function(n) {
			return n === 1 ? "item" : "items";
		}
	},

	// methods that implement data logic.
	// note there's no DOM manipulation here at all.
	methods: {

		addTodo: function() {
			var value = this.newTodo && this.newTodo.trim();

			if (!value) {
				return;
			}


			var formData = this.toFormData({
				title: value,
			});
			// axios.post('http://localhost/php-vue/api/v1.php?action=create', formData)

			axios.post('http://localhost/php-vue/app/TaskController.php?action=create', formData)
				.then(function (response) {
					app.todos.push({
						id: response.data.taskId,
						title: value,
						completed:false,
					});
					console.log(response);

				});


			this.newTodo = "";
		},

		removeTodo: function(todo) {
			this.todos.splice(this.todos.indexOf(todo), 1);
			var formData = this.toFormData({
				id: todo.id,
			});
			// axios.post('http://localhost/php-vue/api/v1.php?action=delete', formData)
			axios.post('http://localhost/php-vue/app/TaskController.php?action=delete', formData)
				.then(function (response) {
					console.log(response);
				});
		},

		changeTaskStatus: function(todo) {
			var formData = this.toFormData({
				id: todo.id,
				title: todo.title,
				completed: todo.completed
			});
			// axios.post('http://localhost/php-vue/api/v1.php?action=updateStatus', formData)
			axios.post('http://localhost/php-vue/app/TaskController.php?action=updateStatus', formData)
				.then(function (response) {
					console.log(response);
				});
		},

		editTodo: function(todo) {
			this.beforeEditCache = todo.title;
			this.editedTodo = todo;
		},

		doneEdit: function(todo) {
			if (!this.editedTodo) {
				return;
			}
			this.editedTodo = null;
			todo.title = todo.title.trim();
			if (!todo.title) {
				this.removeTodo(todo);
			}
			var formData = this.toFormData({
				id: todo.id,
				title: todo.title,
				completed: todo.completed
			});
			// axios.post('http://localhost/php-vue/api/v1.php?action=update', formData)
			axios.post('http://localhost/php-vue/app/TaskController.php?action=update', formData)
				.then(function (response) {
					console.log(response);
				});
		},

		cancelEdit: function(todo) {
			this.editedTodo = null;
			todo.title = this.beforeEditCache;
		},

		removeCompleted: function() {
			this.todos = filters.active(this.todos);
			var formData = this.toFormData({
				completed: 1,
			});
			// axios.post('http://localhost/php-vue/api/v1.php?action=deleteCompleted', formData)
			axios.post('http://localhost/php-vue/app/TaskController.php?action=deleteCompleted', formData)
				.then(function (response) {
					console.log(response);
				});
		},
		getTasks: function () {
			// axios.get('http://localhost/php-vue/api/v1.php?action=read')
			axios.get('http://localhost/php-vue/app/TaskController.php?action=index')
				.then(function (response) {
					console.log(response);
					if (response.data.error) {
						this.errorMessage = response.data.message;
					} else {
						var usersTasks = response.data.task;
						todoStorage.save(usersTasks);
					}
				})
		},
		toFormData: function (obj) {
			var form_data = new FormData();
			for (var key in obj) {
				form_data.append(key, obj[key]);
			}
			return form_data;
		},
	},

	directives: {
		"todo-focus": function(el, binding) {
			if (binding.value) {
				el.focus();
			}
		}
	}
});

// handle routing
function onHashChange() {
	var visibility = window.location.hash.replace(/#\/?/, "");
	if (filters[visibility]) {
		app.visibility = visibility;
	} else {
		window.location.hash = "";
		app.visibility = "all";
	}
}

window.addEventListener("hashchange", onHashChange);
onHashChange();

// mount
app.$mount(".todoapp");