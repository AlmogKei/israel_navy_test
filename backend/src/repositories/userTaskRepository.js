const userTaskRepository = dataSource.getRepository('UserTask');

const newUserTask = userTaskRepository.create({
    user: { id: 1 },
    task: { id: 2 },
});

await userTaskRepository.save(newUserTask);
console.log('UserTask saved:', newUserTask);

const userTasks = await userTaskRepository.find({
    relations: ['user', 'task'],
});
console.log('All UserTasks:', userTasks);


await userTaskRepository.delete({
    user: { id: 1 },
    task: { id: 2 },
});
console.log('UserTask deleted.');
