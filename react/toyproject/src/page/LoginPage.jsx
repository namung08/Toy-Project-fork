import React, { useEffect } from 'react';

const LoginPage = () => {
  useEffect(() => {
    // 코드 확인자 생성 함수
    const generateRandomString = (length) => {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    // SHA256 해시 함수
    const sha256 = async (plain) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      return window.crypto.subtle.digest('SHA-256', data)
    }

    // Base64 인코딩 함수
    const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    // 코드 확인자 생성
    const codeVerifier = generateRandomString(64);

    // 코드 확인자를 SHA256 해시로 변환
    sha256(codeVerifier)
      .then(hash => {
        // 변환된 해시 값을 Base64 인코딩하여 코드 챌린지 생성
        const codeChallenge = base64encode(hash);
        console.log('Code Challenge:', codeChallenge);

        // 나머지 코드 실행 (예: 로그인 요청) : 백 개발 필요
      })
      .catch(error => {
        console.error('Error generating SHA256 hash:', error);
      });

  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 방지

    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        console.log('로그인 성공!');
      } else {
        console.error('로그인 실패!');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">아이디:</label>
        <input type="text" id="username" name="username" />

        <label htmlFor="password">비밀번호:</label>
        <input type="password" id="password" name="password" />

        <button type="submit">로그인</button>
      </form>
      <p>아직 계정이 없으신가요? <a href="/Signup">회원가입</a></p>
    </div>
  );
}

export default LoginPage;