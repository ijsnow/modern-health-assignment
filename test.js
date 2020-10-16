import { request, gql } from "graphql-request";
import test from "ava";
import faker from "faker";

test("can add data and query it", async (t) => {
  const pMutation = gql`
    mutation CreateProgram($program: ProgramInput!) {
      createProgram(program: $program)
    }
  `;

  const program = {
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
  };

  const pRes = await request("http://localhost:4000", pMutation, {
    program,
  });

  const programId = pRes.createProgram;

  const sMutation = gql`
    mutation CreateSection($program: ID!, $section: SectionInput!) {
      createSection(program: $program, section: $section)
    }
  `;

  const section = {
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    overviewImage: faker.image.image(),
    order: 0,
  };

  const sRes = await request("http://localhost:4000", sMutation, {
    program: programId,
    section,
  });

  const sectionId = sRes.createSection;

  const aMutation = gql`
    mutation CreateActivity($section: ID!, $activity: ActivityInput!) {
      createActivity(section: $section, activity: $activity)
    }
  `;

  const activity = {
    content: faker.lorem.paragraph(),
  };

  const aRes = await request("http://localhost:4000", aMutation, {
    section: sectionId,
    activity,
  });

  const activityId = aRes.createActivity;

  const oMutation = gql`
    mutation CreateOption($activity: ID!, $option: OptionInput!) {
      createOption(activity: $activity, option: $option)
    }
  `;

  const option = {
    text: faker.lorem.sentence(),
  };

  const oRes = await request("http://localhost:4000", oMutation, {
    activity: activityId,
    option,
  });

  const optionId = oRes.createOption;

  const query = gql`
    query QueryPrograms($id: ID!) {
      programs(id: $id) {
        id
        name
        description
        sections {
          id
          name
          description
          overviewImage
          order
          activities {
            id
            content
            options {
              id
              text
            }
          }
        }
      }
    }
  `;

  const res = await request("http://localhost:4000", query, {
    id: programId
  });

  t.deepEqual(res, {
    programs: [
      {
        id: programId,
        name: program.name,
        description: program.description,
        sections: [
          {
            id: sectionId,
            name: section.name,
            description: section.description,
            overviewImage: section.overviewImage,
            order: section.order,
            activities: [
              {
                id: activityId,
                content: activity.content,
                options: [
                  {
                    id: optionId,
                    text: option.text,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  t.pass();
});
