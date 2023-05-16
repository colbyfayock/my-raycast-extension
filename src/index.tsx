import { Detail, LaunchProps } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Creature {
  category: string;
  common_locations: Array<string>;
  cooking_effect: string;
  description: string;
  hearts_recovered: number;
  image: string;
  name: string;
}

interface CreatureResponse {
  isLoading: boolean;
  data?: {
    creatures: {
      food: object;
    }
  };
}

interface CreatureArguments {
  name?: string;
}

export default function Command(props: LaunchProps<{ arguments: CreatureArguments }>) {
  const { isLoading, data, revalidate } = useFetch<CreatureResponse>("https://botw-compendium.herokuapp.com/api/v2/all");
  const creatures = data?.data?.creatures.food as Array<Creature>;

  const creature = creatures.find(c => c.name.toLowerCase().includes(props.arguments.name?.toLowerCase() as string))

  const markdown = `
# ${creature?.name}

![](${creature?.image})

${creature?.description}
`;
  
  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      navigationTitle={creature?.name}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Category" text={creature?.category} />
          <Detail.Metadata.Label title="Cooking Effect" text={creature?.cooking_effect} />
          <Detail.Metadata.Label title="Hearts Recovered" text={String(creature?.hearts_recovered)} />
          <Detail.Metadata.TagList title="Type">
            {creature?.common_locations.map(location => {
              return (
                <Detail.Metadata.TagList.Item key={location} text={location} color={"#eed535"} />
              )
            })}
          </Detail.Metadata.TagList>
        </Detail.Metadata>
      }
    />
  );
}
