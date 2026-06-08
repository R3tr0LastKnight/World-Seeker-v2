import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

type MongoUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export function useMongoUser() {
  const { user, loading: authLoading } = useAuth();
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    fetch("/api/me", {
      headers: { "x-firebase-uid": user.uid },
    })
      .then((r) => r.json())
      .then((data) => setMongoUser(data))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return { mongoUser, loading };
}
