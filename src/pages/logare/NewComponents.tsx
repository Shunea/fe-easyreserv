import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  width: 480px;
  height: auto;
  background: #fff;
`;

export const SignUpContainer = styled.div`
  width: 480px;
  height: auto;
  border-radius: 12px;
  background-color: #fff;
`;

export const SignInContainer = styled.div`
  width: 480px;
  height: auto;
  border-radius: 12px;
  background-color: #fff;
`;

export const Form = styled.form`
  box-shadow: 8px 8px 80px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 32px 40px;
  text-align: center;
`;

export const Title = styled.h1`
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%;
  letter-spacing: -0.48px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Input = styled.input`
  display: flex;
  height: 52px;
  width: 400px;
  padding: 0px 16px;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #eee;
  background: var(--brand-snow, #fff);
  outline-color: rgba(254, 152, 0, 0.7);
`;

export const Button = styled.button`
  width: 400px;
  height: 52px;
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  background: var(--brand-sun, #fe9800);
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 125%;
`;

export const Footer = styled.div`
  display: flex;
  height: 60px;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-top: 1px solid #eee;
  border-radius: 0 0 12px 12px;
  background: var(--brand-clouds, #f6f6f6);
`;

export const PlacesNum = styled.div`
  display: flex;
  padding: 4px 6px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 12px;
  width: 20px;
  height: 20px;
  font-size: 12px;
  color: #fff;
  background: #fe9800;
`;
export const Places = styled.div`
  cursor: pointer;
  height: auto;
  display: flex;
  padding: 12px 24px;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  &.active {
    background: rgba(254, 152, 0, 0.1);
  }
`;
