import faker from "faker";

import * as schema from "./schema";
import server from "./server";

async function start(seed) {
  // TODO: add migrations
  await schema.sequelize.sync({ force: true });

  if (seed) {
    // Create sample data
    for (let i = 0; i < 10; i++) {
      const program = await schema.Program.create({
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
      });

      const section = await program.createSection({
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        overviewImage: faker.image.image(),
        order: i,
      });

      const activity = await section.createActivity({
        content: faker.lorem.paragraph(),
      });

      // Make every other activity a multiple choice question
      if (i % 2 === 1) {
        let optionIds = [];
        for (let j = 0; j < 4; j++) {
          const option = await activity.createOption({
            text: faker.lorem.sentence(),
          });
          optionIds.push(option.dataValues.id);
        }
        activity.setAnswer(optionIds[0]);
      }
    }
  }

  // Start the GraphQL server
  server.start(() => {
    console.log("Server is running on localhost:4000");
  });
}

start(process.env.SEED_DATA === "true");
