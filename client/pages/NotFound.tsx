import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="more-container py-16">
      <Result
        status="404"
        title="Page not found"
        subTitle="This page doesn't exist. Your homepage is one click away."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Go to the homepage
          </Button>
        }
      />
    </div>
  );
}
