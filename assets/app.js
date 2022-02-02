// objects
let tasks=[];          //{task:todoInput.value,id:todoDiv.id,check:false}
let subTasks=[];       //{subTask:taskInput.value,id:todoSubDiv.id,parentId:parentId,check:false}

// SELECTORS

const todoInput = document.querySelector('.todo-input');
const todoDate = document.querySelector('#date')
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterSelector = document.querySelector('.filter-todo');

//  EVENT LISTENERS 
document.addEventListener('DOMContentLoaded',getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", addSubTask);
filterSelector.addEventListener("click",filterTodo);


// FUNCTIONS

function addTodo(event){
    event.preventDefault();
    //if todo is empty
    if(todoInput.value===""&&todoDate.value===""){
        alert("Add Task and Date");
        return;
    }
    //creating div 
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.id=Math.random();
    // adding task to array
    tasks.push({task:todoInput.value,id:todoDiv.id,check:false,date:todoDate.value})
    console.log(tasks);
    //Title Todo
    const todoMainDiv = document.createElement("div");
    todoMainDiv.classList.add("todoMain");
    todoDiv.appendChild(todoMainDiv);
    //creating li
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item");
    todoMainDiv.appendChild(newTodo);
    //creating editable task
    const taskInput = document.createElement("input");
    taskInput.classList.add("text");
    taskInput.type="text";
    taskInput.setAttribute("readonly","readonly");
    taskInput.value=todoInput.value;
    newTodo.appendChild(taskInput);
    //date
    const taskDate = document.createElement("input");
    taskDate.classList.add("text");
    taskDate.classList.add("todoDate");
    taskDate.type="date";
    taskDate.setAttribute("readonly","readonly");
    taskDate.value=todoDate.value;
    todoMainDiv.appendChild(taskDate);
    // edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.innerHTML=`<i class="fas fa-edit"></i>`;
    editButton.title="Edit Task";
    todoMainDiv.appendChild(editButton);
    // making task editable
    editButton.addEventListener("click",(e)=>{
        if(editButton.innerHTML==='<i class="fas fa-edit"></i>'){
            editButton.innerHTML='<i class="fas fa-save"></i>';
            taskInput.removeAttribute("readonly");
            taskDate.removeAttribute("readonly");
        }
        else{
            editButton.innerHTML=`<i class="fas fa-edit"></i>`;
            tasks.forEach((task)=>{
                if(task.id===todoDiv.id){
                    task.task=taskInput.value;
                    task.date=taskDate.value;
                    console.log(tasks);
                }
            })
            saveLocalTodos();
            taskInput.setAttribute("readonly","readonly");
            taskDate.setAttribute("readonly","readonly");
        }
    })
    // add subtask button
    const subTaskButton = document.createElement("button");
    subTaskButton.classList.add("sub-btn");
    subTaskButton.innerHTML=`<i class="fas fa-tasks"></i>`;
    subTaskButton.title="Add Subtask";
    todoMainDiv.appendChild(subTaskButton);
    // check button
    const completedButton = document.createElement("button");
    completedButton.classList.add("complete-btn");
    completedButton.innerHTML=`<i class="fas fa-check"></i>`;
    completedButton.title="Task Completed";
    todoMainDiv.appendChild(completedButton);
    completedButton.addEventListener("click",(ev)=>{
        tasks.forEach((task)=>{
            if(task.id===todoDiv.id && task.check){
                task.check=false;
                todoDiv.classList.remove("completed");
            }else if(task.id===todoDiv.id && !task.check){
                task.check=true;
                todoDiv.classList.add("completed");
            }
        })
        saveLocalTodos();
    })
    
    // delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("trash-btn");
    deleteButton.innerHTML=`<i class="fas fa-trash"></i>`;
    deleteButton.title="Delete Task"
    todoMainDiv.appendChild(deleteButton);
    deleteButton.addEventListener("click",(ev)=>{
        tasks.forEach((task,index)=>{
            if(task.id===todoDiv.id){
                tasks.splice(index,1);
                console.log(tasks);
                for(var i=0;i<subTasks.length;i++){
                    if(subTasks[i].parentId===task.id){
                        subTasks.splice(i,1);
                        i--;
                    }
                }                
                saveLocalTodos();
            }
        })
        todoDiv.remove();
    })
    //Adding a div for sub tasks
    const subTodoDiv= document.createElement("div");
    subTodoDiv.classList.add("subTodo-container");
    todoDiv.appendChild(subTodoDiv);
    //Creating a ul for sub tasks
    const ulSubtask = document.createElement("ul");
    ulSubtask.classList.add("subTodo-list");
    subTodoDiv.appendChild(ulSubtask);
    // append to main todo list
    todoList.appendChild(todoDiv);
    todoInput.value="";
    todoDate.value="";
    saveLocalTodos();
};


// Adding Sub-task function
function addSubTask(event){
    const subTask=event.target;
    // Adding sub-task from button only if there is no sub task present
    if(subTask.classList[0]==="sub-btn" 
        && !subTask.parentElement.nextSibling.firstChild.firstChild){
        const ulSubtask=subTask.parentElement.nextSibling.firstChild;
        const parentId=subTask.parentElement.parentElement.id;
        console.log(subTask.parentElement.parentElement.id)
        subTodo(ulSubtask,parentId);
    }
    // Using sub-task button for toggling the view of sub-tasks if there is sub task present
    else if(subTask.classList[0]==="sub-btn" 
        && subTask.parentElement.nextSibling.firstChild.firstChild  ){
        if(subTask.parentElement.nextSibling.style.display==="flex"){
            subTask.parentElement.nextSibling.style.display="none"; 
        }
        else{
            subTask.parentElement.nextSibling.style.display="flex";
        }
    };
    // Adding New sub-task from the button in sub-task tab
    if(subTask.classList[0]==="addNewTask-btn"){
        const ulSubtask=subTask.parentElement.parentElement;
        const parentId=subTask.parentElement.parentElement.parentElement.parentElement.id;
        subTodo(ulSubtask,parentId);
    }
}

// Sub task Function

function subTodo(ulSubtask,parentId){
    const todoSubDiv = document.createElement("div");
    todoSubDiv.classList.add("todoMain");
    todoSubDiv.classList.add("sub");
    todoSubDiv.id=Math.random();
    //creating li
    const newSubTodo = document.createElement("li");
    newSubTodo.classList.add("todo-item");
    todoSubDiv.appendChild(newSubTodo);
    //creating editable sub-task
    const taskInput = document.createElement("input");
    taskInput.classList.add("text");
    taskInput.type="text";
    newSubTodo.appendChild(taskInput);
    // edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.innerHTML=`<i class="fas fa-save"></i>`;
    editButton.title="Edit Task";
    todoSubDiv.appendChild(editButton);
    // making sub-task editable
    editButton.addEventListener("click",(e)=>{
        if(editButton.innerHTML==='<i class="fas fa-save"></i>'){
            editButton.innerHTML='<i class="fas fa-edit"></i>';
            let check;
            subTasks.forEach((subtask)=>{
                if(subtask.id===todoSubDiv.id){
                    subtask.subTask=taskInput.value;
                    return check=1;
                }
            })
            saveLocalTodos();
            taskInput.setAttribute("readonly","readonly");
            if(check==1){
                return;
            }
            subTasks.push({subTask:taskInput.value,id:todoSubDiv.id,parentId:parentId,check:false});
            saveLocalTodos();
        }
        else{
            editButton.innerHTML=`<i class="fas fa-save"></i>`;
            taskInput.removeAttribute("readonly");
        }
    })
    
    //complete button
    const completedButton = document.createElement("button");
    completedButton.classList.add("complete-btn");
    completedButton.innerHTML=`<i class="fas fa-check"></i>`;
    completedButton.title="Task Completed";
    todoSubDiv.appendChild(completedButton);
    completedButton.addEventListener("click",(ev)=>{
        todoSubDiv.classList.toggle("completed");
        let count=0;
        let check=0;
        subTasks.forEach((subtask)=>{
            if(subtask.id===todoSubDiv.id){
                subtask.check=!subtask.check;
            }
            if(subtask.parentId===parentId){
                count++;
            } 
            if(subtask.parentId===parentId && subtask.check){
                check++;
            }
        })
        tasks.forEach((task)=>{
            if (count===check && task.id===parentId && task.check===false){
                task.check=true;
                ulSubtask.parentElement.parentElement.classList.add("completed");
                
            }else if(task.id===parentId){
                task.check=false;
                ulSubtask.parentElement.parentElement.classList.remove("completed");
            }
        })

        saveLocalTodos();
    })
    
    // delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("trash-btn");
    deleteButton.innerHTML=`<i class="fas fa-trash"></i>`;
    deleteButton.title="Delete Task"
    todoSubDiv.appendChild(deleteButton);
    deleteButton.addEventListener("click",(ev)=>{
        subTasks.forEach((task,index)=>{
            if(task.id==todoSubDiv.id){
                subTasks.splice(index,1);
                console.log(subTasks);
                saveLocalTodos();
            }
        })
        todoSubDiv.remove();
    })
    // add new sub task button
    const addNewSubTask=document.createElement("button");
    addNewSubTask.classList.add("addNewTask-btn");
    addNewSubTask.title="Add New Sub-Task";
    addNewSubTask.innerHTML='<i class="fas fa-plus-circle"></i>';
    todoSubDiv.appendChild(addNewSubTask);
    //Appending to main sub task container's ul
    ulSubtask.appendChild(todoSubDiv);
    saveLocalTodos();
}









// Saving Tasks and Subtasks to local Storage

function saveLocalTodos(){
    localStorage.setItem("todos",JSON.stringify(tasks));
    localStorage.setItem("subTodos",JSON.stringify(subTasks));
}

// Retrieving Tasks and SubTasks after reloading 

function getTodos(){

    if(localStorage.getItem("todos")!== null||localStorage.getItem("subTodos")!==null){
        tasks=JSON.parse(localStorage.getItem("todos"));
        subTasks=JSON.parse(localStorage.getItem("subTodos"));
    }
    // Traversing through Tasks Array for last saved values and presenting it to screen
    tasks.forEach((todo)=>{
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        todoDiv.id=todo.id;
        //Title Todo
        const todoMainDiv = document.createElement("div");
        todoMainDiv.classList.add("todoMain");
        if(!todo.check){
            todoDiv.classList.remove("completed");
        }
        else {
                todoDiv.classList.add("completed");
            }
        todoDiv.appendChild(todoMainDiv);
        //creating li
        const newTodo = document.createElement("li");
        newTodo.classList.add("todo-item");
        todoMainDiv.appendChild(newTodo);
        //creating editable task
        const taskInput = document.createElement("input");
        taskInput.classList.add("text");
        taskInput.type="text";
        taskInput.setAttribute("readonly","readonly");
        taskInput.value=todo.task;
        newTodo.appendChild(taskInput);
        //date
        const taskDate = document.createElement("input");
        taskDate.classList.add("text");
        taskDate.classList.add("todoDate");
        taskDate.type="date";
        taskDate.setAttribute("readonly","readonly");
        taskDate.value=todo.date;
        todoMainDiv.appendChild(taskDate);
        // edit button
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.innerHTML=`<i class="fas fa-edit"></i>`;
        editButton.title="Edit Task";
        todoMainDiv.appendChild(editButton);
        // making task editable
        editButton.addEventListener("click",(e)=>{
            if(editButton.innerHTML==='<i class="fas fa-edit"></i>'){
                editButton.innerHTML='<i class="fas fa-save"></i>';
                taskInput.removeAttribute("readonly");
                taskDate.removeAttribute("readonly");
            }
            else{
                editButton.innerHTML=`<i class="fas fa-edit"></i>`;
                tasks.forEach((task)=>{
                    if(task.id===todoDiv.id){
                        task.task=taskInput.value;
                        task.date=taskDate.value;
                        console.log(tasks);
                    }
                })
                saveLocalTodos();
                taskInput.setAttribute("readonly","readonly");
                taskDate.setAttribute("readonly","readonly");
            }
        })
        // add subtask button
        const subTaskButton = document.createElement("button");
        subTaskButton.classList.add("sub-btn");
        subTaskButton.innerHTML=`<i class="fas fa-tasks"></i>`;
        subTaskButton.title="Add Subtask";
        todoMainDiv.appendChild(subTaskButton);
        // check button
        const completedButton = document.createElement("button");
        completedButton.classList.add("complete-btn");
        completedButton.innerHTML=`<i class="fas fa-check"></i>`;
        completedButton.title="Task Completed";
        todoMainDiv.appendChild(completedButton);
        completedButton.addEventListener("click",(ev)=>{
            tasks.forEach((task)=>{
                if(task.id===todoDiv.id && task.check){
                    task.check=false;
                    todoDiv.classList.remove("completed");
                }else if(task.id===todoDiv.id && !task.check){
                    task.check=true;
                    todoDiv.classList.add("completed");
                }
            })
            saveLocalTodos();
        })

        
        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("trash-btn");
        deleteButton.innerHTML=`<i class="fas fa-trash"></i>`;
        deleteButton.title="Delete Task"
        todoMainDiv.appendChild(deleteButton);
        deleteButton.addEventListener("click",(ev)=>{
            tasks.forEach((task,index)=>{
                if(task.id===todoDiv.id){
                    tasks.splice(index,1);
                    for(var i=0;i<subTasks.length;i++){
                        if(subTasks[i].parentId===task.id){
                            subTasks.splice(i,1);
                            i--;
                        }
                    }
                    saveLocalTodos();
                }
            })
            saveLocalTodos();
            todoDiv.remove();
        })
        //Adding a div for sub tasks
        const subTodoDiv= document.createElement("div");
        subTodoDiv.classList.add("subTodo-container");
        todoDiv.appendChild(subTodoDiv);
        //Creating a ul for sub tasks
        const ulSubtask = document.createElement("ul");
        ulSubtask.classList.add("subTodo-list");
        subTodoDiv.appendChild(ulSubtask);
        // append to main todo list
        todoList.appendChild(todoDiv);
    })
    // Traversing through SubTasks Array for last saved values and presenting it to screen
    subTasks.forEach((todos)=>{
        const todoSubDiv = document.createElement("div");
        let ulSubtask= document.getElementById(`${todos.parentId}`);
        ulSubtask= ulSubtask.lastChild.firstChild;
        todoSubDiv.classList.add("todoMain");
        todoSubDiv.classList.add("sub");
        if(todos.check){
            todoSubDiv.classList.add("completed");
        }
        todoSubDiv.id=todos.id;
        //creating li
        const newSubTodo = document.createElement("li");
        newSubTodo.classList.add("todo-item");
        todoSubDiv.appendChild(newSubTodo);
        //creating editable sub-task
        const taskInput = document.createElement("input");
        taskInput.classList.add("text");
        taskInput.type="text";
        taskInput.value=todos.subTask;
        newSubTodo.appendChild(taskInput);
        // edit button
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.innerHTML=`<i class="fas fa-save"></i>`;
        editButton.title="Edit Task";
        todoSubDiv.appendChild(editButton);
        // making sub-task editable
        editButton.addEventListener("click",(e)=>{
            if(editButton.innerHTML==='<i class="fas fa-save"></i>'){
                editButton.innerHTML='<i class="fas fa-edit"></i>';
                let check;
                subTasks.forEach((subtask)=>{
                    if(subtask.id===todoSubDiv.id){
                        subtask.subTask=taskInput.value;
                        return check=1;
                    }
                })
                saveLocalTodos();
                taskInput.setAttribute("readonly","readonly");
                if(check==1){
                    return;
                }
                subTasks.push({subTask:taskInput.value,id:todoSubDiv.id,parentId:parentId});
                saveLocalTodos();
            }
            else{
                editButton.innerHTML=`<i class="fas fa-save"></i>`;
                taskInput.removeAttribute("readonly");
            }
        })
        
        //complete button
        const completedButton = document.createElement("button");
        completedButton.classList.add("complete-btn");
        completedButton.innerHTML=`<i class="fas fa-check"></i>`;
        completedButton.title="Task Completed";
        todoSubDiv.appendChild(completedButton);
        completedButton.addEventListener("click",(ev)=>{
            todoSubDiv.classList.toggle("completed");
            let count=0;
            let check=0;
            subTasks.forEach((subtask)=>{
                if(subtask.id===todoSubDiv.id){
                    subtask.check=!subtask.check;
                }
                if(subtask.parentId===todos.parentId){
                    count++;
                } 
                if(subtask.parentId===todos.parentId && subtask.check){
                    check++;
                }
            })
            saveLocalTodos();
            tasks.forEach((task)=>{
                if (count===check && task.id===todos.parentId && task.check===false){
                    task.check=true;
                    ulSubtask.parentElement.parentElement.classList.toggle("completed");
                    saveLocalTodos();
                    
                }else if(task.id===todos.parentId){
                    task.check=false;
                    ulSubtask.parentElement.parentElement.classList.remove("completed");
                    saveLocalTodos();
                }
            })

        })
        
        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("trash-btn");
        deleteButton.innerHTML=`<i class="fas fa-trash"></i>`;
        deleteButton.title="Delete Task"
        todoSubDiv.appendChild(deleteButton);
        deleteButton.addEventListener("click",(ev)=>{
            subTasks.forEach((task,index)=>{
                if(task.id==todoSubDiv.id){
                    subTasks.splice(index,1);
                    console.log(subTasks);
                    saveLocalTodos();
                }
            })
            todoSubDiv.remove();
        })
        // add new sub task button
        const addNewSubTask=document.createElement("button");
        addNewSubTask.classList.add("addNewTask-btn");
        addNewSubTask.title="Add new Sub-Task";
        addNewSubTask.innerHTML='<i class="fas fa-plus-circle"></i>';
        todoSubDiv.appendChild(addNewSubTask);
        //Appending to main sub task container's ul
        ulSubtask.appendChild(todoSubDiv);
    })
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    let today = new Date();
    let dd = parseInt(String(today.getDate()).padStart(2, '0'));
    let mm = parseInt(String(today.getMonth() + 1).padStart(2, '0')); //January is 0!
    let yyyy = parseInt(today.getFullYear());
    todos.forEach(function(todo) {
        let taskDate = todo.firstChild.firstChild.nextSibling.value;
        let year=parseInt(taskDate.slice(0,4));
        let month=parseInt(taskDate.slice(5,7));
        let date=parseInt(taskDate.slice(8,10));
        console.log(year);
        console.log(month);
        console.log(date);
        console.log(dd);
        switch (e.target.value) {
            case "all":
            todo.style.display = "flex";
            break;
            case "completed":
            if (todo.classList.contains("completed")) {
                todo.style.display = "flex";
            } else {
                todo.style.display = "none";
            }
            break;
            case "today":
                if (yyyy===year && mm===month && dd===date ) {
                todo.style.display = "flex";
                } else {
                todo.style.display = "none";
                }
                break;
            case "upcoming":
                if (yyyy===year && mm===month && date>dd &&date<dd+3) {
                todo.style.display = "flex";
                } else {
                todo.style.display = "none";
                }
                break;
            case "uncompleted":
            if (!todo.classList.contains("completed")) {
                todo.style.display = "flex";
            } else {
                todo.style.display = "none";
            }
      }
    });
  }