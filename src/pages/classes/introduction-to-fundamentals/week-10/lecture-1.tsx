import { Shield } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureTip,
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';

export default function Week9Lecture1() {
    return (
        <LectureLayout>
            <LectureHeader
                week={9}
                session="Lecture 1"
                title="JWT, Sessions & Protecting Routes"
                description="Authentication and authorization on your fundamentals project: JWTs, session management, and protecting API and frontend routes so only the right users see the right data."
                icon={<Shield className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="Why Authentication?" />

            <LectureP>
                So far your app has been open: anyone who hits your API or loads your frontend can read or change data. Real apps need to know <em>who</em> is making the request. <LectureTerm>Authentication</LectureTerm> answers "who are you?" — usually with a login (email + password or OAuth). <LectureTerm>Authorization</LectureTerm> answers "what are you allowed to do?" — e.g. only the owner can edit their own notes.
            </LectureP>
            <LectureP>
                You'll implement auth on the same full-stack project you built in Weeks 4–7. The pattern is the same whether you use FastAPI + React or another stack: the backend issues a credential after login; the frontend sends it on every request; the backend validates it before returning or changing data.
            </LectureP>

            <LectureCallout type="info">
                <LectureTermWithTip tip="A string the server creates after a successful login. The client stores it (e.g. in memory or localStorage) and sends it in the Authorization header on every request. The server verifies it without storing session state.">JWT</LectureTermWithTip> (JSON Web Token) is the most common approach for APIs: stateless, works across servers, and easy to use from React. We'll use it as the default; session cookies are an alternative you'll see in traditional server-rendered apps.
            </LectureCallout>

            <LectureSectionHeading number="02" title="How JWTs Work" />

            <LectureP>
                A JWT has three parts separated by dots: <strong className="text-foreground">header.payload.signature</strong>. The <LectureTerm>payload</LectureTerm> is a JSON object (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{"{ \"sub\": \"user-id-123\", \"exp\": 1734567890 }"}</code>) that can hold user id, email, roles, and an expiration time. The server signs it with a secret; later, it can verify that the token wasn't tampered with and that it hasn't expired.
            </LectureP>
            <LectureP>
                Flow: user logs in with email/password → backend checks credentials → if valid, backend creates a JWT with user id (and optionally roles) and an <LectureTip tip="Expiration time — Unix timestamp. Tokens should have a short lifetime (e.g. 15 min–1 hour) to limit damage if one is stolen.">exp</LectureTip> claim → backend returns the token; frontend stores it and sends <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Authorization: Bearer &lt;token&gt;</code> on every API call → backend middleware validates the token and attaches the user to the request.
            </LectureP>

            <LectureSubHeading title="Never put secrets in the payload" />
            <LectureP>
                The payload is <LectureTermWithTip tip="Base64-encoded — anyone can decode it and read the contents. So never put passwords or secrets inside. Only put non-sensitive identifiers and claims.">base64-encoded</LectureTermWithTip>, not encrypted. Anyone can decode it. Put only non-sensitive data in the payload (user id, email, roles). Never put passwords or API keys there.
            </LectureP>

            <LectureSectionHeading number="03" title="Backend: Login and Token Issuance" />

            <LectureP>
                On the backend you need: (1) a login endpoint that accepts email/password, checks them (e.g. against a users table with hashed passwords), and returns a JWT; (2) a dependency or middleware that reads the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Authorization</code> header, verifies the JWT, and injects the current user into the request.
            </LectureP>
            <TerminalBlock
                title="bash — backend"
                lines={[
                    { comment: 'install JWT and password hashing libs (FastAPI)', cmd: 'pip install python-jose[cryptography] passlib[bcrypt]' },
                ]}
            />
            <LectureSubHeading title="Login endpoint you can copy" />
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    auth.py — login and create token
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ["JWT_SECRET"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form.username)  # your DB lookup
    if not user or not pwd_context.verify(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token, "token_type": "bearer"}
`}
                </pre>
            </div>
            <LectureP>
                Use a library like <LectureTip tip="Python: python-jose or PyJWT. Never roll your own crypto.">python-jose</LectureTip> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">PyJWT</code> to create and verify tokens. Store your <LectureTerm>JWT secret</LectureTerm> in an environment variable — never in code. Hash passwords with <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">bcrypt</code> or your framework's built-in hasher; never store plain-text passwords.
            </LectureP>

            <LectureSectionHeading number="04" title="Protecting API Routes" />

            <LectureP>
                For each endpoint that should require login, depend on a function that extracts and validates the JWT. If the token is missing or invalid, return <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">401 Unauthorized</code>. If valid, attach the user (e.g. from <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">payload["sub"]</code>) to the request and proceed.
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    get_current_user dependency — use on any protected route
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id, "email": payload.get("email")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return user
`}
                </pre>
            </div>
            <LectureP>
                Optional: add a second layer for <LectureTerm>authorization</LectureTerm> — e.g. "only allow if user.role == 'admin' or user.id == resource.owner_id". See Week 10 Lecture 2 for role-based checks.
            </LectureP>
            <LectureCallout type="tip">
                Keep a clear separation: authentication = "is this a valid user?"; authorization = "is this user allowed to do this action?" Implement auth first (every protected route checks for a valid token); then add role or resource checks where needed.
            </LectureCallout>

            <LectureSectionHeading number="05" title="Frontend: Storing and Sending the Token" />

            <LectureP>
                After a successful login, the frontend receives the JWT. You can store it in <LectureTermWithTip tip="Survives refresh but is visible to any script on the page — use for non-sensitive apps; prefer memory + refresh token for higher security.">localStorage</LectureTermWithTip>, in memory (React state/context), or in an HTTP-only cookie (set by the server). For this course, localStorage or in-memory is fine; send it in the <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Authorization: Bearer &lt;token&gt;</code> header for every API request.
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    Frontend — login and attach token to fetch
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`// After login response: { access_token: "eyJ..." }
const res = await fetch(API_URL + "/login", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ username: email, password }),
});
const { access_token } = await res.json();
localStorage.setItem("token", access_token);

// For every API request after that:
const token = localStorage.getItem("token");
fetch(API_URL + "/notes", {
  headers: { Authorization: "Bearer " + token },
});
`}
                </pre>
            </div>
            <LectureP>
                Create a small auth context or module: it holds the token and user info, exposes <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">login</code>, <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">logout</code>, and a function that attaches the token to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">fetch</code> (or axios) requests. Protected routes check "is there a user?" — if not, redirect to login.
            </LectureP>

            <LectureSectionHeading number="06" title="Protected Routes in React" />

            <LectureP>
                A <LectureTerm>protected route</LectureTerm> is a page that only renders when the user is authenticated. In React Router you wrap such routes in a component that reads your auth context: if <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">user</code> is null, redirect to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">/login</code>; otherwise render <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">Outlet</code> or the child route.
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    ProtectedRoute.tsx — wrap routes that require login
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// In your router: <Route element={<ProtectedRoute />}>
//   <Route path="dashboard" element={<Dashboard />} />
// </Route>
`}
                </pre>
            </div>
            <LectureCallout type="warning">
                Protecting the frontend route only hides the UI — it does not secure the API. Always enforce auth (and authorization) on the backend. Otherwise anyone can call your API directly and bypass the frontend.
            </LectureCallout>


        </LectureLayout>
    );
}
