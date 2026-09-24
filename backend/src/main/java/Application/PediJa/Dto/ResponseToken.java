package Application.PediJa.Dto;

public class ResponseToken {

  private String token;
  private String type;
  private long expiresIn;

  public ResponseToken() {
  }

  public ResponseToken(String token, String type, long expiresIn) {
    this.token = token;
    this.type = type;
    this.expiresIn = expiresIn;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public long getExpiresIn() {
    return expiresIn;
  }

  public void setExpiresIn(long expiresIn) {
    this.expiresIn = expiresIn;
  }
}
