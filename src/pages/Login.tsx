import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { globalStyles } from "@/global/styles";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";

const initialState = {
  username: "" as string,
  password: "" as string,
  error: "" as string,
  loading: false,
  errorInputs: {
    username: false,
    password: false,
  },
};

const Login = () => {
  const [stateLocal, setStateLocal] = useState(initialState);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setStateLocal((prev) => ({
      ...prev,
      error: "",
    }));

    if (!stateLocal.username || !stateLocal.password) {
      setStateLocal((prev) => ({
        ...prev,
        error:
          !stateLocal.username && !stateLocal.password
            ? "Preencha todos os campos"
            : !stateLocal.username
            ? "Preencha o campo usuário"
            : "Preencha o campo senha",
      }));
      return;
    }

    setStateLocal((prev) => ({
      ...prev,
      loading: true,
    }));
    const result = await login(stateLocal.username, stateLocal.password);
    setStateLocal((prev) => ({
      ...prev,
      loading: false,
    }));

    if (result.success) {
      navigate("/board");
    } else {
      setStateLocal((prev) => ({
        ...prev,
        error: result.error || "Erro ao fazer login",
      }));
    }
  };

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setStateLocal((prev) => ({
      ...prev,
      username: event.target.value,
    }));
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setStateLocal((prev) => ({
      ...prev,
      password: event.target.value,
    }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: globalStyles.peonWhite }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold" style={{ color: globalStyles.peonGreen }}>
            Login
          </h1>
          <p className="mt-2 text-gray-600">Acesse o painel de coleções</p>
        </div>

        <form onSubmit={onLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <CustomInput
              id="username"
              type="text"
              value={stateLocal.username}
              onChange={onChangeUsername}
              disabled={stateLocal.loading}
              placeHolder="Digite seu usuário"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <CustomInput
              value={stateLocal.password}
              onChange={onChangePassword}
              disabled={stateLocal.loading}
              className="w-full"
              placeHolder="Digite sua senha"
              type="password"
              id="password"
            />
          </div>

          {stateLocal.error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{stateLocal.error}</p>
            </div>
          )}

          <CustomButton
            type="submit"
            disabled={stateLocal.loading}
            className="w-full"
            style={{ backgroundColor: globalStyles.peonGreen }}
          >
            {stateLocal.loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

export default Login;
