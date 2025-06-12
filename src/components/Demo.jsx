import { Avatar, For, HStack } from "@chakra-ui/react"

const Demo = ({
  imageSrc = 'https://plus.unsplash.com/premium_photo-1661768742069-4de270a8d9fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

}) => {
  return (
    <HStack gap="3">
      <For each={["2xl"]}>
        {(size) => (
          <Avatar.Root size={size} key={size}>
            <Avatar.Fallback name="Segun Adebayo" />
            <Avatar.Image src={imageSrc}/>
          </Avatar.Root>
        )}
      </For>
    </HStack>
  )
}

export default Demo;