import Person from "components/chat/Person";

export default function ChatPeopleList() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Person
        index={0}
        isActive={true}
        name={"zu"}
        onlineAt={new Date().toISOString()}
        userId={"isisi"}
        onChatScreen={false}
      />
      <Person
        index={1}
        isActive={false}
        name={"jiyou"}
        onlineAt={new Date().toISOString()}
        userId={"isisi"}
        onChatScreen={false}
      />
    </div>
  );
}
