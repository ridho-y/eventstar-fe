import React, { useContext, useEffect, useState } from "react";
import { isMobileWidth } from "utils/media";
import { useNavigate } from "react-router";
import apiRequest from "utils/api";
import { toast } from "react-toastify";
import { Context } from "Router";
import { Button, Form, Input, Modal } from "antd";
import { Validation } from "pages/profile/Information";
import LoadingPage from "system/LoadingPage";
import { KeyOutlined } from "@ant-design/icons";

const LoginPage: React.FC = () => {
  const [deviceType, setDeviceType] = useState("");
  const { setters } = useContext(Context);

  useEffect(() => {
    localStorage.removeItem("token");
    setters.setIsLoggedIn(false);

    const handleResize = () => {
      if (isMobileWidth()) setDeviceType("mobile");
      else setDeviceType("desktop");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {deviceType === "mobile" && (
        <section className="bg-gray-100 flex items-center justify-center h-full">
          <div className="w-full max-w-md rounded-lg p-6">
            <LoginBlock />
          </div>
        </section>
      )}
      {deviceType === "desktop" && (
        <section className="h-full flex flex-row items-center justify-between bg-gray-100">
          <div className="flex flex-col items-center justify-center px-[3%] w-[40%] mx-auto max-w-xl">
            <LoginBlock />
          </div>
          <div className="w-[50%] h-full">
            <img
              className="object-cover w-full h-full"
              src={require("../../assets/authImage.jpeg")}
              alt="Live Show"
            />
          </div>
        </section>
      )}
    </>
  );
};

const LoginBlock: React.FC = () => {
  const { setters } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameStatusMsg, setUsernameStatusMsg] = useState<Validation>({
    status: "",
    msg: "",
  });
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<Validation>({
    status: "",
    msg: "",
  });
  const [password, setPassword] = useState("");
  const [show2FAPopup, setShow2FAPopup] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const submit = () => {
    if (username === "") {
      setUsernameStatusMsg({
        status: "error",
        msg: "Username cannot be empty",
      });
    } else {
      setUsernameStatusMsg({ status: "", msg: "" });
    }
    if (password === "") {
      setPasswordStatusMsg({
        status: "error",
        msg: "Password cannot be empty",
      });
    } else {
      setPasswordStatusMsg({ status: "", msg: "" });
    }
    if (username !== "" && password !== "") {
      handleLogin(username, password);
    }
  };
  const handleLogin = async (username: string, password: string) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    new Promise(async (resolve) => {
      setLoading(true);
      await apiRequest("POST", "/auth/login", formData)
        .then((res) => {
          if (res.ok) {
            resolve("");
            setters.setToken(res.access_token);
            localStorage.setItem("token", res.access_token);
          } else if (res.status === 403) {
            setShow2FAPopup(true);
          }
          setLoading(false);
        })
        .catch(() => {});
    })
      .then(async () => {
        await apiRequest("GET", "/profile").then((res) => {
          if (res.ok) {
            setters.setIsLoggedIn(true);
            setters.setMemberId(res.memberId);
            setters.setIsHost(res.isHost);
            setters.setName(res.firstName);
            toast.success("Successfully logged in");
            if (res.isHost) {
              navigate("/host-dashboard");
            } else {
              navigate("/");
            }
          }
          setLoading(false);
        });
      })
      .catch(() => { });
  };

  const handle2FAPopupClose = () => {
    setShow2FAPopup(false);
    setClientSecret("");
  };

  const [loading2fa, setLoading2fa] = useState(false);

  const handle2FATokenSubmit = async (
    username: string,
    password: string,
    clientSecret: string
  ) => {
    setLoading2fa(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("client_secret", clientSecret);
    new Promise(async (resolve) => {
      await apiRequest("POST", "/auth/login", formData)
        .then((res) => {
          if (res.ok) {
            setters.setToken(res.access_token);
            localStorage.setItem("token", res.access_token);
            setShow2FAPopup(false);
            setClientSecret("");
            resolve("");
          }
        })
        .then(async () => {
          await apiRequest("GET", "/profile").then((res) => {
            if (res.ok) {
              setters.setIsLoggedIn(true);
              setters.setMemberId(res.memberId);
              setters.setIsHost(res.isHost);
              toast.success("Successfully logged in");
              navigate("/");
            }
            setLoading(false);
          });
          setLoading(false);
        })
        .catch(() => {});
    });
  };

  const [form] = Form.useForm();

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="p-6">
          <p className="text-h2 md:text-h2-md py-2">Sign In</p>
          <Form className="" form={form}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-h4 md:text-h4-md font-medium mt-6"
              >
                Email or Username
              </label>
              <Form.Item
                validateStatus={`${usernameStatusMsg.status}`}
                help={usernameStatusMsg.msg}
                className="!text-h5 !md:text-h5-md"
                hasFeedback
              >
                <Input
                  size="large"
                  placeholder="Enter your email or username"
                  className="text-h4 md:text-h4-md"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </Form.Item>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-h4 md:text-h4-md mt-6"
              >
                Password
              </label>
              <Form.Item
                validateStatus={`${passwordStatusMsg.status}`}
                help={passwordStatusMsg.msg}
                className="!text-h5 !md:text-h5-md"
                hasFeedback
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  className="text-h4 md:text-h4-md"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </Form.Item>
            </div>
            <div className="flex justify-end mt-7 mb-7">
              <a
                href="#"
                className="text-h4 hover:underline"
                onClick={() => navigate("/reset/password/request")}
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="primary"
              className="w-full h-14 flex items-center justify-center"
              onClick={submit}
            >
              <p className="text-h3 md:text-h3">Sign In</p>
            </Button>
            <p className="text-h4 text-center pt-6 mb-2">
              Don’t have an account yet?{" "}
              <a
                href="#"
                className="font-bold hover:underline"
                onClick={() => navigate("/sign-up")}
              >
                Sign Up
              </a>
            </p>
          </Form>
        </div>
        {/* 2FA Token Input Popup */}
        {show2FAPopup && (
          <Modal
            visible={show2FAPopup}
            footer={null}
            onCancel={handle2FAPopupClose}
            centered
            closable={false}
            width={400}
            bodyStyle={{ padding: "2rem" }}
          >
            {loading2fa ? (
              <LoadingPage />
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <h2 className="text-h2 md:text-h2-md font-medium mb-4">
                    Enter 2FA Code
                  </h2>
                  <Input
                    size="large"
                    placeholder="Enter your 2FA code"
                    className="text-h4 md:text-h4-md mb-4"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    prefix={<KeyOutlined className="text-gray-500 text-2xl" />}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="default"
                      className="mr-2"
                      onClick={handle2FAPopupClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={() =>
                        handle2FATokenSubmit(username, password, clientSecret)
                      }
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Modal>
        )}
      </div>
    );
  }
};

export default LoginPage;
