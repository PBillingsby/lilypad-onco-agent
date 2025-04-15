import Form from "./components/Form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Form />
      <div className="bg-inherit w-full">
        <p className="mx-auto text-xl py-2 text-center text-black">
          Powered by{" "}
          <a href="https://docs.lilypad.tech" target="_blank">
            Lilypad
          </a>
        </p>
      </div>
    </div>
  );
}
