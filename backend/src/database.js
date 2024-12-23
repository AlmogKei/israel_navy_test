const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://development_mbkc_user:VID2LjAmMPnNNtfbTPCkMVxycGAkLXVu@dpg-ctjktstumphs73fbs4g0-a.oregon-postgres.render.com/development_mbkc',
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: true,
    logging: true,
    entities: [User, Task]
});

// בדיקת חיבור לדאטהבייס
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        
        // בדיקה שאפשר לגשת למשתמשים
        return AppDataSource.getRepository(User).count();
    })
    .then(count => {
        console.log(`Database connection verified. Found ${count} users.`);
    })
    .catch(err => {
        console.error("Error during Data Source initialization:", err);
    });