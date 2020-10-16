import "dotenv/config";
import Sequelize, { DataTypes } from "sequelize";
import { resolver, defaultArgs } from "graphql-sequelize";

export const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: "database",
    dialect: "postgres",
  }
);

export let Program = sequelize.define("program", {
  name: DataTypes.STRING,
  description: DataTypes.STRING(1024),
});

defaultArgs(Program);

export let Section = sequelize.define("section", {
  name: DataTypes.STRING,
  description: DataTypes.STRING(1024),
  overviewImage: DataTypes.STRING,
  order: DataTypes.INTEGER,
});

Program.Sections = Program.hasMany(Section, { as: "sections" });

export let Activity = sequelize.define("activity", {
  content: DataTypes.STRING(1024),
});

Section.Activities = Section.hasMany(Activity, { as: "activities" });

export let Option = sequelize.define("option", {
  text: DataTypes.STRING,
});

Activity.Options = Activity.hasMany(Option, { as: "options" });
Activity.Answer = Activity.hasOne(Option, { as: "answer" });

export const typeDefs = `
  type Query {
    programs(id: ID): [Program]
  }

  type Program {
    id: ID!
    name: String
    description: String
    sections: [Section]
  }

  type Section {
    id: ID!
    name: String
    description: String
    overviewImage: String
    order: Int
    activities: [Activity]
  }

  type Activity {
    id: ID!
    content: String
    options: [Option]
    answer: Option
  }

  type Option {
    id: ID!
    text: String
  }

  type Mutation {
    createProgram(program: ProgramInput!): ID
    createSection(program: ID!, section: SectionInput!): ID
    createActivity(section: ID!, activity: ActivityInput): ID
    createOption(activity: ID!, option: OptionInput): ID
  }

  input ProgramInput {
    name: String
    description: String
  }

  input SectionInput {
    name: String
    description: String
    overviewImage: String
    order: Int
  }

  input ActivityInput {
    content: String
  }

  input OptionInput {
    text: String
  }
`;

export const resolvers = {
  Query: {
    programs: resolver(Program),
  },
  Program: {
    sections: resolver(Program.Sections),
  },
  Section: {
    activities: resolver(Section.Activities),
  },
  Activity: {
    options: resolver(Activity.Options),
    answer: resolver(Activity.Answer),
  },
  Mutation: {
    createProgram: async (_, { program }) => {
      const model = await Program.create(program);

      return model.dataValues.id;
    },
    createSection: async (_, { program, section }) => {
      const model = await Program.findByPk(program);
      const sModel = await model.createSection(section);

      return sModel.dataValues.id;
    },
    createActivity: async (_, { section, activity }) => {
      const model = await Section.findByPk(section);
      const aModel = await model.createActivity(activity);

      return aModel.dataValues.id;
    },
    createOption: async (_, { activity, option }) => {
      const model = await Activity.findByPk(activity);
      const oModel = await model.createOption(option);

      return oModel.dataValues.id;
    },
  },
};
