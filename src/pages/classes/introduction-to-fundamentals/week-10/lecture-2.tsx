import { Shield } from 'lucide-react';
import {
    LectureLayout,
    LectureHeader,
    LectureCallout,
    LectureSectionHeading,
    LectureSubHeading,
    LectureP,
    LectureTerm,
    LectureTermWithTip,
} from '@/components/ui/lecture-typography';
import { TerminalBlock } from '@/components/ui/terminal-block';

export default function Week9Lecture2() {
    return (
        <LectureLayout>
            <LectureHeader
                week={9}
                session="Lecture 2"
                title="Identity & User Context"
                description="User context across the stack, role-based access, and how to keep your project secure as you add more features."
                icon={<Shield className="h-4 w-4" />}
            />

            <LectureSectionHeading number="01" title="User Context Across the Stack" />

            <LectureP>
                Once a user is authenticated, their identity should flow through the whole app: the backend knows "who is this?" for every request, and the frontend can show "logged in as …" and personalize data. That's <LectureTerm>user context</LectureTerm>. On the backend you get it from the validated JWT (user id, email, roles). On the frontend you get it from your auth state (token + decoded user or a small /me endpoint).
            </LectureP>
            <LectureP>
                A common pattern: after login, the frontend stores the token and optionally calls <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">GET /me</code> (or similar) to fetch the current user's profile. That profile (id, email, display name, role) lives in React context so any component can read it. When the token expires or the user logs out, clear the context and redirect to login.
            </LectureP>

            <LectureSectionHeading number="02" title="Role-Based Access" />

            <LectureP>
                <LectureTermWithTip tip="Restricting actions by role — e.g. only admins can delete users; only the owner can edit a resource. Implement after authentication.">Role-based access control</LectureTermWithTip> (RBAC) means different users have different permissions. For example: <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">admin</code> can do everything; <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">user</code> can only edit their own data; <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">guest</code> can only read. Store the role in the user record and in the JWT payload so the backend can check it on each request.
            </LectureP>
            <LectureP>
                On protected endpoints, after verifying the JWT, check something like <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">if user.role != "admin": raise 403</code>. On the frontend you can hide or disable buttons based on role, but again: the backend must enforce it. Never trust the client.
            </LectureP>

            <LectureSubHeading title="Backend: one dependency for current user" />
            <LectureP>
                In FastAPI, use a single dependency that validates the JWT and returns the current user. Every route that needs auth depends on it. Copy this pattern into your project and adjust the payload shape to match your JWT.
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    auth.py — get current user from JWT
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = credentials.credentials
    try:
        payload = decode_jwt(token)  # your decode function
        user_id = payload.get("sub")
        email = payload.get("email")
        role = payload.get("role", "user")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id, "email": email, "role": role}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

# Optional: dependency that requires admin
def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user
`}
                </pre>
            </div>

            <LectureSubHeading title="Using the dependency in routes" />
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    main.py — protected routes
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`@app.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return user  # frontend can call this to get current user profile

@app.delete("/users/{user_id}")
def delete_user(user_id: str, user: dict = Depends(require_admin)):
    # Only admins reach here
    ...

# Resource-level: only owner can update their note
@app.patch("/notes/{note_id}")
def update_note(note_id: int, data: NoteUpdate, user: dict = Depends(get_current_user)):
    note = get_note_or_404(note_id)
    if str(note.owner_id) != str(user["id"]):
        raise HTTPException(status_code=403, detail="Not the owner")
    ...
`}
                </pre>
            </div>

            <LectureCallout type="info">
                For resource-level permissions ("only the owner can edit this note"), compare <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">request.user.id</code> to the resource's <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">owner_id</code> (or equivalent). Return 403 Forbidden if they don't match.
            </LectureCallout>

            <LectureSubHeading title="Frontend: user context" />
            <LectureP>
                After login, store the token and optionally fetch the current user. Put the user (and a logout function) in React context so any component can show "Logged in as …" or hide links by role.
            </LectureP>
            <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
                <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700">
                    AuthContext.tsx — minimal pattern
                </div>
                <pre className="bg-zinc-950 p-5 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`// After login: setToken(result.token); setUser(result.user) or fetch GET /me
const [user, setUser] = useState(null);
const [token, setToken] = useState(localStorage.getItem("token"));

useEffect(() => {
  if (!token) { setUser(null); return; }
  fetch(API_URL + "/me", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((r) => r.ok ? r.json() : Promise.reject())
    .then(setUser)
    .catch(() => { setToken(null); setUser(null); });
}, [token]);

const logout = () => {
  localStorage.removeItem("token");
  setToken(null);
  setUser(null);
};

// In components: const { user } = useAuth(); then user?.email, user?.role
`}
                </pre>
            </div>

            <LectureSubHeading title="Testing protected routes" />
            <LectureP>
                From the terminal you can verify that unauthenticated requests get 401 and that a valid token returns the user or resource.
            </LectureP>
            <TerminalBlock
                title="bash — test /me and protected routes"
                lines={[
                    { comment: 'no token — should get 401', cmd: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/me' },
                    { comment: 'with token — replace YOUR_JWT with a real token from login', cmd: 'curl -s -H "Authorization: Bearer YOUR_JWT" http://localhost:8000/me' },
                ]}
            />

            <LectureSectionHeading number="03" title="Keeping Secrets Safe" />

            <LectureP>
                Your JWT secret, database URL, and API keys must never end up in code or in the repo. Use <LectureTerm>environment variables</LectureTerm> (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> locally, and your host's env config in production). Add <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.env</code> to <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">.gitignore</code> and document required variables in the README without values.
            </LectureP>
            <LectureSubHeading title="Password handling" />
            <LectureP>
                Never log or return passwords. Hash them with bcrypt (or your framework's default) before storing. Use HTTPS in production so credentials and tokens aren't sent in the clear. If a token is compromised, short expiration times and refresh tokens (or re-login) limit the damage.
            </LectureP>

            <LectureSectionHeading number="04" title="Scaling Auth as You Add Features" />

            <LectureP>
                As you add more endpoints and pages, keep one place that validates the JWT and loads the user (e.g. a FastAPI dependency or Express middleware). Then every route that needs auth just declares that dependency. New features automatically get auth if they use the same pattern. If you later add OAuth (Google, GitHub login), the only change is how you create the user and issue the first token; the rest of the pipeline stays the same.
            </LectureP>
            <LectureCallout type="tip">
                Document your auth flow in the README: how to get a token (login endpoint, body params), how to send it (header name and format), and which routes require it. That helps you and reviewers when debugging.
            </LectureCallout>

            
        </LectureLayout>
    );
}
