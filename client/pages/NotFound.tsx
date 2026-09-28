import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import { usePersona } from "@/context/persona-context";

export default function NotFound() {
  const navigate = useNavigate();
  const { persona } = usePersona();

  return (
    <div className="relay-container py-16">
      <Result
        status="404"
        title="Page not found"
        subTitle="This page doesn't exist. Your homepage is one click away."
        extra={
          <Button type="primary" onClick={() => navigate(`/${persona.countries[0]}`)}>
            Go to my homepage
          </Button>
        }
      />
    </div>
  );
}
