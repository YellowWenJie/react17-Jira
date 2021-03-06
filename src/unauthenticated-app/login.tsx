import React, { FormEvent } from "react";
import { useAuth } from "../context/auth-context";

export const LoginScreen = () => {
  const { login } = useAuth();

  const handleSubmit = (event: FormEvent<HTMLFormElement> | undefined) => {
    // 阻止默认行为
    event?.preventDefault();
    const username = (event?.currentTarget.elements[0] as HTMLInputElement)
      .value;
    const password = (event?.currentTarget.elements[1] as HTMLInputElement)
      .value;
    login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名</label>
        <input type="text" id={"username"} />
      </div>
      <div>
        <label htmlFor="username">密码</label>
        <input type="text" id={"password"} />
      </div>
      <button type={"submit"}>登录</button>
    </form>
  );
};
