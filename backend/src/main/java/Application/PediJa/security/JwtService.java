package Application.PediJa.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  private final SecretKey signingKey;
  private final long expirationMillis;

  public JwtService(
      @Value("${security.jwt.secret}") String secret,
      @Value("${security.jwt.expiration-ms:3600000}") long expirationMillis) {
    this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    this.expirationMillis = expirationMillis;
  }

  public String generateToken(UserDetails userDetails) {
    Date issuedAt = new Date();
    Date expiration = new Date(issuedAt.getTime() + expirationMillis);

    return Jwts.builder()
        .subject(userDetails.getUsername())
        .claim("roles", userDetails.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .toList())
        .issuedAt(issuedAt)
        .expiration(expiration)
        .signWith(signingKey)
        .compact();
  }

  public String extractUsername(String token) {
    return parseClaims(token).getSubject();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    Claims claims = parseClaims(token);
    return claims.getSubject().equals(userDetails.getUsername())
        && claims.getExpiration().after(new Date());
  }

  private Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(signingKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  public long getExpirationMillis() {
    return expirationMillis;
  }
}
