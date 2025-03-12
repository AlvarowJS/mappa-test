export const rateLimits = new Map<string, { count: number; lastReset: number }>();
const maxLimit = 5;
const interval = 1000;

export const rateLimiter = async (c: any, next: Function) => {

    // al ejecutar en local el proyecto este asumira como un unknown, ya que este server
    // no esta detra de un proxy, asi que al no ver ip, imaginemos que unknown es el ip :D 
    // 1. la primera condicion verificara si es dentro del map, y si no esta da entender que es la primera
    // 2. la segunda condicion en base al ip se encargara de verificar si paso mas de 1 segundo o reiniciara el contador
    // 3. si el contador no pasa de 5 solicitud este seguira pasando la solicitud
    // y por ultimo si ninguna condicion se cumple lanzara el error
    const ip = c.req.raw.headers.get("x-forwarded-for") || "unknown";
    const currentTime = Date.now();

    if (!rateLimits.has(ip)) {
        rateLimits.set(ip, { count: 1, lastReset: currentTime });
        return next();
    }

    const userData = rateLimits.get(ip)!;
    if (currentTime - userData.lastReset > interval) {
        userData.count = 1;
        userData.lastReset = currentTime;
        return next();
    }

    if (userData.count < maxLimit) {
        userData.count++;
        return next();
    }

    return c.json({ error: "Too many requests." }, 429);
};
