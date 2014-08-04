App = Ember.Application.create();

App.Store = DS.Store.extend()

App.Router.map(function() {
    this.resource('about');
    this.resource('history');
    this.resource('students', function() {
        this.resource('student', {
            path: ':student_id'
        });
    });
    this.resource('classes', function() {
        this.resource('class', {
            path: ':class_id'
        });
    });
});

App.Class = DS.Model.extend({
    name: DS.attr('string'),
});

App.Student = DS.Model.extend({
    name: DS.attr('string'),
    rank: DS.attr('string'),
    email: DS.attr('string'),
    phone: DS.attr('string'),
});

App.ClassesRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('class');
    }
});

App.StudentsRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('student');
    }
});

App.StudentController = Ember.ObjectController.extend({
    isEditing: false,
    actions: {
        edit: function() {
            this.set('isEditing', true);
        },
        doneEditing: function(s) {
            this.set('isEditing', false);
            console.log(this);
        }
    }
});

Ember.Handlebars.helper('format-date', function(date) {
    return date;
})